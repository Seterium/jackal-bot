import { Telegraf } from 'telegraf'
import importDirectory from 'esm-import-directory'
import cast from 'cast'

import getLocale from '#@/Utils/getLocale.js'
import logger from '#@/Utils/logger.js'

import { allowedUsersIds } from '#@/constants.js'

class JackalBot {
  bot = null

  actions = {}

  commands = []

  async init () {
    this.bot = new Telegraf(process.env.BOT_TOKEN)

    try {
      await this.initMiddleware()

      $jcb.log('Middleware initialized')
    } catch (error) {
      return $jcb.log('Middleware initialization error', error)
    }

    try {
      await this.initCommands()

      $jcb.log('Commands handlers initialized')
    } catch (error) {
      return $jcb.log('Commands handlers initialization error', error)
    }
    
    try {
      await this.initActions()

      $jcb.log('Callback actions handlers initialized')
    } catch (error) {
      return $jcb.log('Callback actions handlers initialization error', error)
    }
    
    this.bot.launch()

    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))

    console.log('\r\n', getLocale('jackal'), '\r\n')
  }

  async initMiddleware () {
    this.bot.use(async (context, next) => {
      const shouldProcess = (context.update.message || context.update.callback_query) 

      if (!shouldProcess) return

      const { from } = context.update.callback_query || context.update.message 

      if (!allowedUsersIds.includes(from.id)) return

      try {
        await next()
      } catch (error) {
        return logger(error)
      }
    })
  }

  async initCommands () {
    const path = `${process.env.PWD}/src/Controllers/Commands`

    this.commands = await importDirectory(path, {
      recursive: true
    })

    const duplicates = this.commands.map(({ command }) => command).filter((e, index, arr) => arr.indexOf(e) !== index)

    if (duplicates.length) {
      return $jcb.log(`Duplicate handlers for command(s) "${duplicates.join(', ')}" found`)
    }

    this.setCommandsHandlers()
  }

  setCommandsHandlers () {
    this.commands.forEach((command) => {  
      this.bot.command(command.command, context => {  
        const { entities } = context.update.message

        const params = {}
  
        if (command.params) {
          entities.shift()

          let index = 0

          for (let key in command.params) {
            const {
              required,
              type = 'string',
              default: def
            } = command.params[key]

            if (!context.update.message.entities[index]) {
              const text = getLocale(`commands/validation/required`, {
                key
              })

              return context.reply(text, {
                parse_mode: 'HTML'
              })
            }

            const { offset, length } = context.update.message.entities[index]
            const paramValue = context.update.message.text.substring(offset, offset + length)

            if (paramValue) {
              params[key] = cast(paramValue, type)
            } else if (required) {
              const text = getLocale(`commands/validation/required`, {
                key
              })

              context.reply(text, {
                parse_mode: 'HTML'
              })
            } else {
              params[key] = def
            }
          }
        } else {
          const { offset, length } = entities[0]
          const { text } = context.update.message
  
          params.query = context.update.message.text.substring(offset + length + 1, text.length).trim()
        }

        const {
          username,
          id
        } = context.update.message.from
  
        $jcb.log(`Income command: "${command.command}", from @${username} [ID:${id}], params: ${JSON.stringify(params, null, 2)}`)

        if (command.validate) {
          try {
            command.validate(params)
          } catch (error) {
            $jcb.log(`Income command: "${command.command}", from @${username} [ID:${id}], validation error: ${JSON.stringify({ error }, null, 2)}`)

            return context.reply(error, {
              parse_mode: 'HTML'
            })
          }
        }

        command.handler(context, params)
      })
    })
  }

  async initActions () {
    const path = `${process.env.PWD}/src/Controllers/Actions`

    const actions = await importDirectory(path, {
      recursive: true
    })

    actions.forEach((action) => {
      if (this.actions[action.action]) {
        return $jcb.log(`Duplicate handlers for action "${action.action}" found`)
      }

      this.actions[action.action] = action
    })

    this.setActionsHandlers()
  }

  setActionsHandlers () {
    this.bot.on('callback_query', async (context) => {
      const [ action, ...rawParams ] = context.update.callback_query.data.split('|')

      if (action === 'none') {
        return context.answerCbQuery().catch()
      }

      if (!actions[action]) {
        return $jcb.log(`Unknown action "${action}"`, true)
      }

      const params = {}

      if (actions[action].params) {
        let index = 0

        for (let key in actions[action].params) {
          const {
            required,
            type = 'string',
            default: def
          } = actions[action].params[key]

          const paramValue = rawParams[index]

          if (paramValue) {
            params[key] = cast(paramValue, type)
          } else if (required) {
            const error = `Missing required param ${key} in action ${action}`

            return $jcb.log(`Income action: "${command.command}", from @${username} [ID:${id}], validation error: ${JSON.stringify({ error }, null, 2)}`)
          } else {
            params[key] = def
          }

          index += 1
        }
      }

      const {
        username,
        id
      } = context.update.callback_query.from

      $jcb.log(`Income action: "${action}", from @${username} [ID:${id}], params: ${JSON.stringify(params, null, 2)}`)

      if (!actions[action].noAutoanswer) {
        context.answerCbQuery().catch()
      }

      if (actions[action].validate) {
        try {
          actions[action].validate(params)
        } catch (error) {
          return context.answerCbQuery(error).catch()
        }
      }

      actions[action].handler(context, params)
    })
  }

  runAction (action, context, params) {
    if (!this.actions[action]) {
      return $jcb.log(`Unknown action "${action}"`)
    }

    this.actions[action].handler(context, params)
  }
}

export default new JackalBot