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

  validate({ page }) {
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
      return context.answerCbQuery(this.$loc('errors/noMore'))
    }

    const message = this.$loc('index', {
      ...result,
      videos: result.videos
    })

    const keyboard = result.videos.map(({ id, key }, index) => {
      const prevVideoId = index >= 1 
        ? result.videos[index - 1].id
        : ''
      const nextVideoId = index < result.videos.length - 1
        ? result.videos[index + 1].id
        : ''

      return {
        text: key,
        callback_data: `getVideo|${id}|${prevVideoId}|${nextVideoId}`
      }
    })

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