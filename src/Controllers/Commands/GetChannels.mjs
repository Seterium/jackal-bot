import Controller from '#@/Controllers/Controller.js'

class GetChannels extends Controller {
  command = 'channels'

  async handler (context) {}
}

export default new GetChannels