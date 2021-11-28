
import { channels } from '#@/utils/constants.js'
import getLocale from '#@/utils/helpers/getLocale.js'

export default {
  handler (context) {
    const text = getLocale('commands/channels')

    const keyboard = channels.map(({ id, name }) => {
      return [
        {
          text: name,
          callback_data: `getChannel|${id}`
        }
      ]
    })

    context.reply(text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }
}