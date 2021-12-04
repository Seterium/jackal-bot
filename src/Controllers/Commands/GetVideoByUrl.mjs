import Controller from '#@/Controllers/Controller.js'

class GetVideoByUrl extends Controller {
  command = 'url'

  params = {
    url: {
      type: 'string',
      required: true
    }
  }

  validate(context, { url }) {}
  
  async handler (context, { url }) {}
}

export default new GetVideoByUrl