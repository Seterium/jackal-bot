import getLocale from '#@/utils/getLocale.js'

export default {
  command: 'start',

  async handler(context) {
    const text = getLocale('commands/start', {
      username: context.update.message.from.username
    })

    context.reply(text, {
      parse_mode: 'HTML'
    })
  }
}