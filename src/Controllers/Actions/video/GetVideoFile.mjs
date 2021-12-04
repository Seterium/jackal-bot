import Controller from '#@/Controllers/Controller.js'

class GetVideoFile extends Controller {
  action = 'downloadVideo'

  locales = 'video'

  params = {
    id: {
      type: 'string',
      required: true
    }
  }

  async handler(context, { id, quality, compression }) {}
}

export default new GetVideoFile