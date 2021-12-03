import chunk from 'lodash.chunk'

import YtData from '#@/Services/YtData.js'

import getLocale from '#@/utils/getLocale.js'

export default {
  command: 'video',

  validate(context, { query }) {
    if (!query) {
      context.reply(getLocale('commands/video/errors/queryRequired'))

      return false
    }

    if (query.length < 3) {
      context.reply(getLocale('commands/video/errors/queryInvalid'))

      return false
    }

    return true
  },

  async handler(context, { query }) {
    try {
      const result = await YtData.search(query, 'video')

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
}