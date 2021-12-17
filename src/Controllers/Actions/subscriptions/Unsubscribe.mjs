import Controller from '#@/Controllers/Controller.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

class Unsubscribe extends Controller {
  action = 'unsubscribe'

  locales = 'subscriptions'

  params = {
    channelId: {
      type: 'string',
      required: true
    },
    videoId: {
      type: 'string',
      default: ''
    }
  }

  noAutoanswer = true

  async handler (context, { channelId, videoId }) {
    const subscription = SubscriptionsModel.getSubscription(
      context.update.callback_query.from.id,
      channelId
    )

    SubscriptionsModel.delete(
      context.update.callback_query.from.id,
      channelId
    )

    const keyboard = []

    if (videoId) {
      keyboard.push(
        [
          {
            text: `📺 ${subscription.channel.title}`,
            callback_data: `getChannel|${channelId}`
          },
        ],
        [
          {
            text: '➕ Подписаться',
            callback_data: `subscribe|${channelId}|${videoId}`
          },
          {
            text: '🔕 Уведомления выкл.',
            callback_data: 'notificationsUnavailable'
          },
        ],
        [
          {
            text: '📦 Скачать',
            callback_data: `getVideoFormats|${videoId}`
          }
        ]
      )
    } else {
      keyboard.push(
        [
          {
            text: '➕ Подписаться',
            callback_data: `subscribe|${channelId}`
          },
          {
            text: '🔕 Уведомления выкл.',
            callback_data: `enableNotifications|${channelId}`
          }
        ],
        [
          {
            text: '🎬 Видео',
            callback_data: `getChannelVideos|${channelId}`
          }
        ]
      )
    }

    context.answerCbQuery(this.$loc())

    context.editMessageReplyMarkup({
      inline_keyboard: keyboard
    })
  }
}

export default new Unsubscribe