import chunk from 'lodash.chunk'

import YtData from '#@/Services/YtData.js'

import getLocale from '#@/Utils/getLocale.js'
import formatViews from '#@/Utils/formatViews.js'

export default {
  action: 'getChannelVideos',

  noAutoanswer: true,

  validate(context, [ , page ]) {
    page = parseInt(page)

    if (page < 1) {
      context.answerCbQuery('Все, дно достингнуто, дальше только рубль')

      return
    }

    if (page > 10) {
      context.answerCbQuery('Все, потолок, дальше живут драконы')

      return
    }

    return true
  },

  async handler(context, [ id, page = 1, update = 0 ]) {
    page = parseInt(page)
    update = !!parseInt(update)

    let result

    try {
      result = await YtData.getChannelVideos(id, page)
    } catch (error) {
      return context.reply(getLocale('actions/getChannelVideos/errors/fatal'))
    }

    if (!result.videos.length && update) {
      context.answerCbQuery('Больше видео нет')
    }

    const videos = result.videos.map(({ duration, views, ...video }) => ({
      ...video,
      duration: `${duration.minutes}:${duration.seconds}`,
      views: formatViews(views)
    }))

    const message = getLocale('actions/getChannelVideos/index', {
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
        callback_data: `getChannelVideos|${id}|${page - 1}|1`
      },
      {
        text: `Страница: ${page}`,
        callback_data: 'none'
      },
      {
        text: '➡️',
        callback_data: `getChannelVideos|${id}|${page + 1}|1`
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