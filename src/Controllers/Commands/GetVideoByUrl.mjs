import ytdl from 'ytdl-core'

import getLocale from '#@/utils/getLocale.js'

export default {
  name: 'video',

  params: [
    'url'
  ],
  
  async handler (context, { url }) {
    let id

    try {
      id = ytdl.getURLVideoID(url)
    } catch (error) {
      return context.reply(getLocale('commands/url/errors/invalid'))
    }
    
    context.reply(`Video ID: ${id}`)
  }
}