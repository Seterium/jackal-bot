import ytch from 'yt-channel-info'
import ytdl from 'ytdl-core'

export default {
  async getChannel(id) {    
    const data = await ytch.getChannelInfo(id)

    return data
  },

  async getVideo(id) {
    const { videoDetails } = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${id}`)

    return videoDetails
  } 
}