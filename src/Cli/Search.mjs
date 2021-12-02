import YtData from '#@/Services/YtData.js'

import logger from '#@/Utils/logger.js'

export default {
  command: 'search',

  description: 'Search Youtube video',

  arguments: [
    {
      name: 'query',
      description: 'Search query',
      required: true
    }
  ],

  options: [
    {
      name: '--channel',
      description: 'Search channel by query',
      default: false
    }
  ],

  async handler (query, options) {
    const searchType = options.channel
      ? 'channel'
      : 'video'

    try {
      const result = await YtData.search(query, searchType)

      console.log(result)
    } catch (error) {
      logger(error)
    }
  }
}