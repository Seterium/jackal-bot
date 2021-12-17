import Controller from '#@/Controllers/Controller.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

class GetChannel extends Controller {
  action = 'getChannel'

  locales = 'channel'

  params = {
    id: {
      type: 'string',
      required: true
    }
  }

  async handler(context, { id }) {
    let channel

    try {
      channel = await this.$yt.getChannel(id)
    } catch (error) {
      return context.reply(this.$loc('errors/fatal'))
    }

    const message = this.$loc('index', {
      ...channel,
      description: channel.description.length > 960
        ? `${channel.description.slice(0, 960)} ...`
        : channel.description
    })

    const subscription = SubscriptionsModel.isUserSubscribedToChannel(
      context.update.callback_query.from.id,
      id
    )

    console.log(subscription)

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
  }
}

export default new GetChannel