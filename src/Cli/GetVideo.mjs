import ytcog from 'ytcog'

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
    const {
      USER_AGENT,
      COOKIE
    } = process.env
  
    const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    await session.fetch()

    const video = new ytcog.Video(session, {
      id
    })

    try {
      await video.fetch()

      console.log(video)
    } catch (error) {
      logger(error)
    }
  }
}