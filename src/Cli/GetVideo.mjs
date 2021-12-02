import YtData from '#@/Services/YtData.js'

import logger from '#@/Utils/logger.js'

export default {
  command: 'video',

  description: 'Get Youtube video details by ID',

  arguments: [
    {
      name: 'id',
      description: 'Youtube video ID',
      required: true
    }
  ],

  async handler(id) {
    try {
      const video = await YtData.getVideo(id)

      console.log(video)
    } catch (error) {
      logger(error)
    }
  }
}