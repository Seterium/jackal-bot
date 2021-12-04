import Controller from '#@/Controllers/Controller.js'

class NotificationsUnavailable extends Controller {
  action = 'notificationsUnavailable'

  locales = 'notifications'

  noAutoanswer = true

  async handler (context) {
    context.answerCbQuery(this.$loc(), {
      show_alert: true
    })
  }
}

export default new NotificationsUnavailable