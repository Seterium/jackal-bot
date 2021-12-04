import Controller from '#@/Controllers/Controller.js'

class RemovePrevMesage extends Controller {
  action = 'removePrevMessage'

  async handler(context) {
    context.deleteMessage()
  }
}

export default new RemovePrevMesage
