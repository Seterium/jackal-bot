import { Telegraf } from 'telegraf'
import importDirectory from 'esm-import-directory'
import cast from 'cast'

import getLocale from '#@/Utils/getLocale.js'

import { allowedUsersIds } from '#@/constants.js'

export default {
  bot: null,

  async init () {
    console.log('\r\n[JCB] Initialize Jackal bot\r\n')

    this.bot = new Telegraf(process.env.BOT_TOKEN)

    this.bot.use(async (context, next) => {
      const { from } = context.update.callback_query || context.update.message

      if (!allowedUsersIds.includes(from.id)) {
        return
      }

      await next()
    })

    try {
      await this.initCommands()

      console.log('[JCB] Commands system initialized')
    } catch (error) {
      console.log('[JCB] Commands system initialization error')

      console.error(error)

      return
    }
    
    try {
      await this.initActions()

      console.log('[JCB] Actions system initialized')
    } catch (error) {
      console.log('[JCB] Actions system initialization error')

      console.error(error)

      return
    }
    
    this.bot.launch()

    console.log('\r\n[JCB] Jackal bot initialized')

    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))

    console.log('\r\n', getLocale('jackal'), '\r\n')
  },

  async initCommands() {
    const commands = await importDirectory(`${process.env.PWD}/src/Controllers/Commands`)

    const duplicates = commands.map(({ command }) => command).filter((e, index, arr) => arr.indexOf(e) !== index)

    if (duplicates.length) {
      throw new Error(`Duplicate handlers for command(s) "${duplicates.join(', ')}" found`)
    }

    commands.forEach((command) => {  
      this.bot.command(command.command, context => {  
        const params = {}
        const { entities } = context.update.message
  
        // TODO Заменить params на объект
        if (command.params?.length) {
          entities.shift()
  
          command.params.forEach((key, index) => {
            if (!context.update.message.entities[index]) {
              params[key] = null
              
              return
            }
  
            const { offset, length } = context.update.message.entities[index]
  
            params[key] = context.update.message.text.substring(offset, offset + length)
          })
        } else {
          const { offset, length } = entities[0]
          const { text } = context.update.message
  
          params.query = context.update.message.text.substring(offset + length + 1, text.length).trim()
        }

        if (command.validate) {
          try {
            command.validate(context, params)
          } catch (error) {
            context.reply(error, {
              parse_mode: 'HTML'
            })

            return
          }
        }

        command.handler(context, params)
      })
    })
  },

  async initActions() {
    const actionsList = await importDirectory(`${process.env.PWD}/src/Controllers/Actions`)

    const actions = {}

    actionsList.forEach((action) => {
      if (actions[action.action]) {
        throw new Error(`Duplicate handlers for action "${action.name}" found`)
      }

      actions[action.action] = action
    })

    this.bot.on('callback_query', async (context) => {
      const [ action, ...rawParams ] = context.update.callback_query.data.split('|')

      const params = {}

      if (actions[action].params) {
        let index = 0

        for (let key in actions[action].params) {
          const {
            required,
            type,
            default: def
          } = actions[action].params[key]

          const paramValue = rawParams[index]

          if (paramValue) {
            params[key] = cast(paramValue, type)
          } else if (required) {
            throw new Error(`Missing required param '${key}' in action ${action}`)
          } else {
            params[key] = def
          }

          index += 1
        }
      }

      if (action === 'none') {
        context.answerCbQuery('Хз че ты хотел, мне ответить нечего')

        return
      }

      if (!actions[action]) {
        console.error(`Unknown action "${action}"`)

        return
      }

      if (!actions[action].noAutoanswer) {
        context.answerCbQuery()
      }

      if (actions[action].validate) {
        try {
          actions[action].validate(context, params)
        } catch (error) {
          context.answerCbQuery(error)

          return
        }
      }

      actions[action].handler(context, params)
    })
  }
}