import SubscriptionsModel from '#@/Models/Subscriptions.js'

import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'unsubscribe',

  params: {
    channelId: {
      type: 'string',
      required: true
    },
    videoId: {
      type: 'string',
      default: ''
    }
  },

  noAutoanswer: true,

  async handler (context, {channelId, videoId }) {
    let subscription

    try {
      subscription = await SubscriptionsModel.model.findOne({
        'channel.id': channelId,
        user: context.update.callback_query.from.id
      })
      
      await subscription.delete()
    } catch (error) {
      return context.answerCbQuery(getLocale('actions/unsubscribe/errors/unableDelete'))
    }

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

    context.answerCbQuery(getLocale('actions/unsubscribe/index'))

    context.editMessageReplyMarkup({
      inline_keyboard: keyboard
    })
  }
}