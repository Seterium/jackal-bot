import YtData from '#@/Services/YtData.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'getChannel',

  params: {
    id: {
      type: 'string',
      required: true
    }
  },

  async handler(context, { id }) {
    let channel

    try {
      channel = await YtData.getChannel(id)
    } catch (error) {
      return context.reply(getLocale('actions/getChannel/errors/fatal'))
    }

    const message = getLocale('actions/getChannel/index', {
      ...channel,
      description: channel.description.length > 960 
        ? `${channel.description.slice(0, 960)} ...`
        : channel.description
    })

    let subscription = false

    try {
      subscription = await SubscriptionsModel.model.findOne({
        'channel.id': id,
        user: context.update.callback_query.from.id
      })
    } catch (error) {}

    const keyboard = [
      [
        {
          text: subscription 
            ? '➖ Отписаться'
            : '➕ Подписаться',
          callback_data: subscription
            ? `unsubscribe|${subscription.id}|${id}`
            : `subscribe|${id}`
        },
        {
          text: '🔕 Уведомления выкл.',
          callback_data: subscription
            ? `enableNotifications|${id}`
            : 'notificationsUnavailable'
        },
      ],
      [
        {
          text: '🎬 Видео',
          callback_data: `getChannelVideos|${id}|1`
        }
      ]
    ]

    const params = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    }

    if (channel.cover) {
      context.replyWithPhoto(channel.cover, {
        caption: message,
        ...params
      })
    } else {
      context.reply(message, {
        ...params
      })
    }
  },
}