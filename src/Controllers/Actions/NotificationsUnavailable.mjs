import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'notificationsUnavailable',

  noAutoanswer: true,

  async handler (context) {
    context.answerCbQuery(getLocale('actions/notificationsUnavailable/index'), {
      show_alert: true
    })
  }
}