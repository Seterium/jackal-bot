import { Telegraf } from 'telegraf'
import importDirectory from 'esm-import-directory'
import cast from 'cast'

import getLocale from '#@/Utils/getLocale.js'
import logger from '#@/Utils/logger.js'

import { allowedUsersIds } from '#@/constants.js'

class JackalBot {
  bot = null

  actions = {}

  commands = {}

  async init () {
    console.log('\r\n[JCB] Initialize Jackal bot\r\n')

    this.bot = new Telegraf(process.env.BOT_TOKEN)

    try {
      await this.initMiddleware()

      console.log('[JCB] Middleware initialized')
    } catch (error) {
      console.log('[JCB] Middleware initialization error')

      return logger(error)
    }

    try {
      await this.initCommands()

      console.log('[JCB] Commands handlers initialized')
    } catch (error) {
      console.log('[JCB] Commands handlers initialization error')

      return logger(error)
    }
    
    try {
      await this.initActions()

      console.log('[JCB] Callback actions handlers initialized')
    } catch (error) {
      console.log('[JCB] Callback actions handlers initialization error')

      return logger(error)
    }
    
    this.bot.launch()

    console.log('\r\n[JCB] Jackal bot initialized')

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

    const commands = await importDirectory(path, {
      recursive: true
    })

    this.commands = commands

    const duplicates = commands.map(({ command }) => command).filter((e, index, arr) => arr.indexOf(e) !== index)

    if (duplicates.length) {
      throw new Error(`Duplicate handlers for command(s) "${duplicates.join(', ')}" found`)
    }

    commands.forEach((command) => {  
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

        if (command.validate) {
          try {
            command.validate(params)
          } catch (error) {
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

    const actionsList = await importDirectory(path, {
      recursive: true
    })

    const actions = {}

    actionsList.forEach((action) => {
      if (actions[action.action]) {
        throw new Error(`Duplicate handlers for action "${action.name}" found`)
      }

      actions[action.action] = action
    })

    this.actions = actions

    this.bot.on('callback_query', async (context) => {
      const [ action, ...rawParams ] = context.update.callback_query.data.split('|')

      if (action === 'none') {
        return context.answerCbQuery().catch()
      }

      if (!actions[action]) {
        return console.error(`Unknown action "${action}"`)
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
            throw new Error(`Missing required param ${key} in action ${action}`)
          } else {
            params[key] = def
          }

          index += 1
        }
      }

      if (!actions[action].noAutoanswer) {
        context.answerCbQuery().catch()
      }

      if (actions[action].validate) {
        try {
          actions[action].validate(params)
        } catch (error) {
          console.log(error)

          return context.answerCbQuery(error).catch()
        }
      }

      actions[action].handler(context, params)
    })
  }

  action (action, context, params) {
    if (!this.actions[action]) {
      return console.error(`Unknown action "${action}"`)
    }

    this.actions[action].handler(context, params)
  }
}

export default new JackalBot