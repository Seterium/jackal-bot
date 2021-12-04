import Controller from '#@/Controllers/Controller.js'

class GetStart extends Controller {
  command = 'start'

  async handler(context) {
    context.reply(this.$loc('index', {
      username: context.update.message.from.username
    }))
  }
}

export default new GetStart