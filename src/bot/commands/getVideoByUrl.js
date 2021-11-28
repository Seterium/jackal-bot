import ytdl from 'ytdl-core'

import getLocale from '#@/utils/helpers/getLocale.js'

export default {
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