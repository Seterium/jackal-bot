import Controller from '#@/Controllers/Controller.js'

class DisableNotifications extends Controller {
  action = 'disableNotifications'

  locales = 'notifications'

  params = {
    subscriptionId: {
      type: 'string',
      required: true
    }
  }

  noAutoanswer = true

  async handler (context) {
    context.answerCbQuery(this.$loc())
  }
}

export default new DisableNotifications