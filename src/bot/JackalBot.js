import { Telegraf } from 'telegraf'

import queryDecode from '#@/utils/helpers/queryDecode.js'
import locale from '#@/utils/helpers/locale.js'

import commands from './commands/_index.js'
import actions from './actions/_index.js'

export default class JackalBot {
  telegraf = null

  actions = {}

  constructor() {
    this.telegraf = new Telegraf(process.env.BOT_TOKEN)

    this.telegraf.on('callback_query', context => {
      const { action, payload } = queryDecode(context.update.callback_query.data)

      if (!this.actions[action]) {
        console.error(`Handler not found for action: ${action}`)
        return
      }

      this.actions[action](context, payload)
    })

    this.telegraf.launch()

    process.once('SIGINT', () => this.telegraf.stop('SIGINT'))
    process.once('SIGTERM', () => this.telegraf.stop('SIGTERM'))

    console.log(locale('jackal'))
  }

  command(name, controller = name) {
    if (!commands[controller]) {
      throw new Error(`Controller "${controller}" for command "${name}" not found`)
    }

    this.telegraf.command(name, commands[controller])
  }

  action(name, controller = name) {
    if (!actions[controller]) {
      throw new Error(`Controller "${controller}" for action "${name}" not found`)
    }

    this.actions[name] = actions[controller]
  }
}