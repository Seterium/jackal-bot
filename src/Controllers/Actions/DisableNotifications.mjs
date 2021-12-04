import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'disableNotifications',

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