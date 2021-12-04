import chunk from 'lodash.chunk'

import Controller from '#@/Controllers/Controller.js'

import formatViews from '#@/Utils/formatViews.js'

class GetChannelVideos extends Controller {
  action = 'getChannelVideos'

  locales = 'channel'

  params = {
    id: {
      type: 'string',
      required: true,
    },
    page: {
      type: 'integer',
      default: 1
    },
    update: {
      type: 'boolean',
      default: false
    }
  }

  noAutoanswer = true

  validate(_, { page }) {
    if (page < 1) {
      throw this.$loc('errors/minPage')
    }

    if (page > 10) {
      throw this.$loc('errors/maxPage')
    }
  }

  async handler(context, { id, page, update }) {
    let result

    try {
      result = await this.$yt.getChannelVideos(id, page)
    } catch (error) {
      return context.reply(this.$loc('errors/fatal'))
    }

    if (!result.videos.length && update) {
      context.answerCbQuery('Больше видео нет')
    }

    const videos = result.videos.map(({ duration, views, ...video }) => ({
      ...video,
      duration: `${duration.minutes}:${duration.seconds}`,
      views: formatViews(views)
    }))

    const message = this.$loc('index', {
      ...result,
      videos
    })

    const keyboard = videos.map(({ id, key }) => ({
      text: key,
      callback_data: `getVideo|${id}`
    }))

    const pagination = [
      {
        text: '⬅️',
        callback_data: `getChannelVideos|${id}|${page - 1}|true`
      },
      {
        text: `Страница: ${page}`,
        callback_data: 'none'
      },
      {
        text: '➡️',
        callback_data: `getChannelVideos|${id}|${page + 1}|true`
      },
    ]

    const params = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          ...chunk(keyboard, 5),
          pagination
        ]
      }
    }

    if (update) {
      context.editMessageText(message, params)
    } else {
      context.reply(message, params)
    }
  }
}

export default new GetChannelVideos