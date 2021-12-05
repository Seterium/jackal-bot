import Controller from '#@/Controllers/Controller.js'

import getIdFromUrl from '#@/Utils/getIdFromUrl.js'

class GetVideoByUrl extends Controller {
  command = 'url'

  params = {
    url: {
      type: 'string',
      required: true
    }
  }
  
  async handler (context, { url }) {
    let id

    try {
      id = getIdFromUrl(url)
    } catch (error) {
      const message = typeof error === 'string'
        ? this.$loc(`errors/${error}`)
        : this.$loc(`errors/fatal`)

      return context.reply(message, {
        parse_mode: 'HTML'
      })
    }

    this.$jc.runAction('getVideo', context, {
      id
    })
  }
}

export default new GetVideoByUrl