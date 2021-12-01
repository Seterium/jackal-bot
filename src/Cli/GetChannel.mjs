import ytcog from 'ytcog'

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
    const {
      USER_AGENT,
      COOKIE
    } = process.env
  
    const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    await session.fetch()
    
    const channel = new ytcog.Channel(session, {
      id,
      items: 'videos',
      quantity: 30
    })

    try {
      await channel.fetch()
  
      console.log(channel)
    } catch (error) {
      logger(error)
    }
  }
}