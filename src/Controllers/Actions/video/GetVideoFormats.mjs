import Controller from '#@/Controllers/Controller.js'

class GetVideoFormats extends Controller {
  action = 'getVideoFormats'

  params = {
    id: {
      type: 'string',
      required: true
    }
  }

  async handler (context, { id }) {}
}

export default new GetVideoFormats