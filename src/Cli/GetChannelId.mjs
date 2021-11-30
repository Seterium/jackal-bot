import getYouTubeIdByUrl from '@gonetone/get-youtube-id-by-url'
import logger from '#@/Utils/logger.js'

export default {
  command: 'yt-id',

  description: 'Get Youtube channel ID by URL',

  arguments: [
    {
      name: 'url',
      description: 'Channel URL',
      required: true
    }
  ],

  async handler (url) {
    const splittedUrl = url.split('/')
  
    let usertag = splittedUrl.pop()
    const usertagType = splittedUrl.pop()
  
    if (/^[\u0400-\u04FF]+$/.test(usertag)) {
      usertag = encodeURIComponent(usertag)
    }
  
    const requestUrl = `https://www.youtube.com/${usertagType}/${usertag}`
  
    try {
      const id = await getYouTubeIdByUrl.channelId(requestUrl)
  
      console.log(`Channel ID: ${id}`)
    } catch (error) {
      logger(error)
    }
  }
}