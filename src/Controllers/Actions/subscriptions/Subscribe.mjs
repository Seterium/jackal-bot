import Controller from '#@/Controllers/Controller.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

class Subscribe extends Controller {
  action = 'subscribe'

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
    let channel

    try {
      channel = await this.$yt.getChannel(channelId)
    } catch (error) {
      return context.answerCbQuery(this.$loc('errors/unableGetChannelData'))
    }

    const count = SubscriptionsModel.getUserSubscriptions(
      context.update.callback_query.from.id
    ).length

    if (count >= +process.env.MAX_SUBSCRIPTIONS) {
      const text = this.$loc('errors/unableAddMore', {
        max: process.env.MAX_SUBSCRIPTIONS
      })

      return context.answerCbQuery(text, {
        show_alert: true
      })
    }

    SubscriptionsModel.add({
      channel: {
        id: channel.id,
        title: channel.title
      },
      user: context.update.callback_query.from.id
    })

    context.answerCbQuery(this.$loc('index', {
      title: channel.title
    }))

    const keyboard = []

    if (videoId) {
      keyboard.push(
        [
          {
            text: `📺 ${channel.title}`,
            callback_data: `getChannel|${channelId}`
          },
        ],
        [
          {
            text: '➖ Отписаться',
            callback_data: `unsubscribe|${channelId}|${videoId}`
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
          },
          {
            text: '◀️ Назад',
            callback_data: 'removePrevMessage'
          }
        ]
      )
    } else {
      keyboard.push(
        [
          {
            text: '➖ Отписаться',
            callback_data: `unsubscribe|${channelId}`
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

    context.editMessageReplyMarkup({
      inline_keyboard: keyboard
    })
  }
}

export default new Subscribe