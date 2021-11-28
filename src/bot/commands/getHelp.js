import getLocale from '#@/utils/helpers/getLocale.js'

export default {
  handler (context) {
    const text = getLocale('commands/help')

    context.reply(text, {
      parse_mode: 'HTML'
    })
  }
}