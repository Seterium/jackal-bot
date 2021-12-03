import getLocale from '#@/Utils/getLocale.js'

export default {
  command: 'help',

  async handler (context) {
    const text = getLocale('commands/help')

    context.reply(text, {
      parse_mode: 'HTML'
    })
  }
}