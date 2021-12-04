import chunk from 'lodash.chunk'

import Controller from '#@/Controllers/Controller.js'

class SearchChannel extends Controller {
  command = 'channel'

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
    let list = []

    try {
      list = await YtData.search(query, 'channel')
    } catch (error) {
      context.reply(this.$loc('errors/fatal'))

      return
    }

    if (!list.length) {
      context.reply(this.$loc('empty', {
        query
      }))
    }

    const message = this.$loc('index', {
      query,
      list
    })

    const keyboard = list.map(({ id, key }) => ({
      text: key,
      callback_data: `getChannel|${id}`
    }))

    context.reply(message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: chunk(keyboard, 4)
      }
    })
  }
}

export default new SearchChannel