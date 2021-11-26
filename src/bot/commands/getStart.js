import getLocale from '#@/utils/helpers/getLocale.js'

export default {
  handler(context) {
    const text = getLocale('commands/start', {
      name: context.update.message.from.username
    })

    const inline_keyboard = new Array(20).fill(1).map((item, index) => ([
      {
        text: `Action ${item + index}`,
        callback_data: `${item + index}`
      }
    ]))

    inline_keyboard.push([
      {
        text: '⬅️',
        callback_data: '<'
      },
      {
        text: '➡️',
        callback_data: '<'
      },
    ])
  
    context.reply(text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard
      }
    })
  }
}