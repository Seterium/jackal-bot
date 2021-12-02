import YtData from '#@/Services/YtData.js'

import logger from '#@/Utils/logger.js'

export default {
  command: 'channel',

  description: 'Get Youtube channel description by ID',

  arguments: [
    {
      name: 'id',
      description: 'Youtube channel ID',
      required: true
    }
  ],

  async handler (id) {
    try {
      const channel = await YtData.getChannel(id)
  
      console.log(channel)
    } catch (error) {
      logger(error)
    }
  }
}