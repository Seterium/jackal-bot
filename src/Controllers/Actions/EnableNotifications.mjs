import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'enableNotifications',

  params: {
    subscriptionId: {
      type: 'string',
      required: true
    }
  },

  noAutoanswer: true,

  async handler (context) {
    context.answerCbQuery(getLocale('actions/notifications/wip'))
  }
}