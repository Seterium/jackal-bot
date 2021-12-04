import Controller from '#@/Controllers/Controller.js'

class GetHelp extends Controller {
  command = 'help'

  async handler (context) {
    context.reply(this.$loc())
  }
}

export default new GetHelp