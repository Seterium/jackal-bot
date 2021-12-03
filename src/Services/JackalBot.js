import { Telegraf } from 'telegraf'
import importDirectory from 'esm-import-directory'

import getLocale from '#@/Utils/getLocale.js'

import { allowedUsersIds } from '#@/constants.js'

export default {
  telegraf: null,

  async init () {
    console.log('\r\n[JCB] Initialize Jackal bot system\r\n')

    this.telegraf = new Telegraf(process.env.BOT_TOKEN)

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
    
    this.telegraf.launch()

    process.once('SIGINT', () => this.telegraf.stop('SIGINT'))
    process.once('SIGTERM', () => this.telegraf.stop('SIGTERM'))

    console.log()
    console.log(getLocale('jackal'))
  },

  async initCommands() {
    const commands = await importDirectory(`${process.env.PWD}/src/Controllers/Commands`)

    const duplicates = commands.map(({ command }) => command).filter((e, index, arr) => arr.indexOf(e) !== index)

    if (duplicates.length) {
      throw new Error(`Duplicate handlers for command(s) "${duplicates.join(', ')}" found`)
    }

    commands.forEach((command) => {  
      this.telegraf.command(command.command, context => {
        if (!allowedUsersIds.includes(context.update.message.from.id)) {
          return
        }
  
        const params = {}
        const { entities } = context.update.message
  
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
          if (command.validate(context, params)) {
            command.handler(context, params)
          }
        } else {
          command.handler(context, params)
        }
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

    this.telegraf.on('callback_query', async (context) => {
      if (!allowedUsersIds.includes(context.update.callback_query.from.id)) {
        return
      }

      const [ action, ...params ] = context.update.callback_query.data.split('|')

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
        if (actions[action].validate(context, params)) {
          actions[action].handler(context, params)
        }
      } else {
        actions[action].handler(context, params)
      }
    })
  }
}