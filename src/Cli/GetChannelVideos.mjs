import YtData from '#@/Services/YtData.js'

import logger from '#@/Utils/logger.js'

export default {
  command: 'channelVideos',

  description: 'Get Youtube channel videos by ID',

  arguments: [
    {
      name: 'id',
      description: 'Youtube channel ID',
      required: true
    },
    {
      name: 'page',
      description: 'Page number',
      default: 1
    }
  ],

  async handler (id, page) {
    try {
      const result = await YtData.getChannelVideos(id, page)
  
      console.log(result)
    } catch (error) {
      logger(error)
    }
  }
}