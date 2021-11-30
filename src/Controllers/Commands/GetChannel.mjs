
import { channels } from '#@/constants.js'
import getLocale from '#@/utils/getLocale.js'

export default {
  name: 'channels',

  async handler (context) {
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