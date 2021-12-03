import chunk from 'lodash.chunk'

import YtData from '#@/Services/YtData.js'

import getLocale from '#@/utils/getLocale.js'

export default {
  command: 'channel',

  validate(context, { query }) {
    if (!query) {
      throw getLocale('commands/channel/errors/queryRequired')
    }

    if (query.length < 3) {
      throw getLocale('commands/channel/errors/queryInvalid')
    }
  },

  async handler(context, { query }) {
    let list = []

    try {
      list = await YtData.search(query, 'channel')
    } catch (error) {
      context.reply(getLocale('commands/channel/errors/fatal'))

      return
    }

    if (!list.length) {
      context.reply(getLocale('commands/channel/empty', {
        query
      }))
    }

    const message = getLocale('commands/channel/index', {
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