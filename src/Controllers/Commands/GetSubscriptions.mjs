import chunk from 'lodash.chunk'

import Controller from '#@/Controllers/Controller.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

import { recommendedChannels } from '#@/constants.js'

class GetSubscriptions extends Controller {
  command = 'subscriptions'

  async handler (context) {
    let subscriptions

    subscriptions = SubscriptionsModel.getUserSubscriptions(
      context.message.from.id
    )

    if (!subscriptions.length) {
      const keyboard = recommendedChannels.map(({ id, title }) => ({
        text: title,
        callback_data: `getChannel|${id}`
      }))

      return context.reply(this.$loc('empty'), {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: chunk(keyboard, 2)
        }
      })
    }

    const keyboard = subscriptions.map(({ channel: { id, title } }) => ({
      text: title,
      callback_data: `getChannel|${id}`
    }))

    context.reply(this.$loc(), {
      reply_markup: {
        inline_keyboard: chunk(keyboard, 2)
      }
    })
  }
}

export default new GetSubscriptions