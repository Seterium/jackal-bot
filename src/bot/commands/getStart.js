import getLocale from '#@/utils/helpers/getLocale.js'

export default {
  handler(context) {
    const text = getLocale('commands/start', {
      username: context.update.message.from.username
    })

    context.reply(text, {
      parse_mode: 'HTML'
    })
  }
}