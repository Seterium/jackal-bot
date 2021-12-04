import Controller from '#@/Controllers/Controller.js'

class EnableNotifications extends Controller {
  action = 'enableNotifications'

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

export default new EnableNotifications