import Controller from '#@/Controllers/Controller.js'

import SubscriptionsModel from '#@/Models/Subscriptions.js'

import dayjs from '#@/Utils/dayjs.js'
import formatViews from '#@/Utils/formatViews.js'

class GetVideo extends Controller {
  action = 'getVideo'

  params = {
    id: {
      type: 'string',
      required: true
    }
  }
  
  async handler(context, { id }) {
    let video

    try {
      video = await this.$yt.getVideo(id)
    } catch (error) {
      return context.reply(this.$loc('errors/fatal'))
    }

    const {
      channel,
      rating,
      published,
      views,
      duration: {
        minutes,
        seconds
      }
    } = video

    const ratingsIcons = ['🟤', '🔴', '🟠', '🟢', '🟢']

    const ratingLabel = rating
      ? `${ratingsIcons[Math.trunc(rating)]} ${rating.toFixed(2)}`
      : '⚫️ ???'

    const uploaded = dayjs(published).format('DD MMM. YYYY')
    const viewsCount = formatViews(views)

    const message = this.$loc('index', {
      ...video,
      duration: `${minutes}:${seconds}`,
      rating: ratingLabel,
      views: viewsCount,
      uploaded
    })

    let subscription

    try {
      subscription = await SubscriptionsModel.model.findOne({
        'channel.id': channel.id,
        user: context.update.callback_query.from.id
      })
    } catch (error) {
      subscription = false
    }

    const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

    const keyboard = [
      [
        {
          text: `📺 ${channel.title}`,
          callback_data: `getChannel|${channel.id}`
        },
      ],
      [
        {
          text: subscription 
            ? '➖ Отписаться'
            : '➕ Подписаться',
          callback_data: subscription
            ? `unsubscribe|${channel.id}|${video.id}`
            : `subscribe|${channel.id}|${video.id}`
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
          text: '📦 Скачать',
          callback_data: `getVideoFormats|${id}`
        }
      ]
    ]
    
    await context.replyWithPhoto(cover, {
      caption: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }
}

export default new GetVideo