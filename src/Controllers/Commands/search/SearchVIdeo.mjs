import chunk from 'lodash.chunk'

import Controller from '#@/Controllers/Controller.js'

class SearchVideo extends Controller {
  command = 'video'

  locales = 'search'

  validate({ query }) {
    if (!query) {
      throw this.$loc('errors/queryRequired')
    }

    if (query.length < 3) {
      throw this.$loc('errors/queryInvalid')
    }
  }

  async handler(context, { query }) {
    let videos

    try {
      videos = await this.$yt.search(query, 'video')
    } catch (error) {
      return context.reply(this.$loc('errors/fatal'))
    }

    if (!videos.length) {
      return context.reply(this.$loc('empty', {
        query
      }))
    }

    const message = this.$loc('index', {
      query,
      videos
    })

    const keyboard = videos.map(({ id, key }) => ({
      text: key,
      callback_data: `getVideo|${id}`
    }))

    context.reply(message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: chunk(keyboard, 4)
      }
    })
  }
}

export default new SearchVideo