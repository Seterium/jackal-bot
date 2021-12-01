import youtube from '@yimura/scraper'

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
    const instance = new youtube.default()

    try {
      const result = await instance.search(query, {
        language: 'ru-RU',
        searchType: options.channel ? 'channel' : 'video'
      })

      console.log(result)
    } catch (error) {
      logger(error)
    }
  }
}