import { Telegraf } from 'telegraf'
import qs from 'qs'

import getLocale from '#@/utils/helpers/getLocale.js'

import commands from './commands/_index.js'
import actions from './actions/_index.js'

export default class JackalBot {
  constructor() {
    this.telegraf = new Telegraf(process.env.BOT_TOKEN)

    this.telegraf.on('callback_query', context => {
      const { action, params } = this.decodeQuery(context.update.callback_query.data)

      if (!this.actions[action]) {
        console.error(`Handler not found for action: ${action}`)

        return
      }

      this.actions[action](context, params)
    })

    this.telegraf.launch()

    process.once('SIGINT', () => this.telegraf.stop('SIGINT'))
    process.once('SIGTERM', () => this.telegraf.stop('SIGTERM'))

    console.log(getLocale('jackal'))
  }

  command(name, controller, keys = []) {
    if (!commands[controller]) {
      throw new Error(`Controller "${controller}" for command "${name}" not found`)
    }

    this.telegraf.command(name, context => {
      const params = {}
      const { entities } = context.update.message

      if (keys.length) {
        entities.shift()

        keys.forEach((key, index) => {
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

        params.query = context.update.message.text.substring(offset + length + 1, text.length)
      }

      commands[controller].handler(context, params)
    })
  }

  action(name, controller) {
    if (!actions[controller]) {
      throw new Error(`Controller "${controller}" for action "${name}" not found`)
    }

    this.actions[name] = actions[controller].handler
  }

  decodeQuery(query) {
    const { a: action, ...params } = qs.parse(query)

    return {
      action,
      params
    }
  }
}