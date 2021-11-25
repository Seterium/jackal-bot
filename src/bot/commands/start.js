import queryEncode from '#@/src/utils/helpers/queryEncode.js'
import locale from '#@/src/utils/helpers/locale.js'

export default context => {
  const text = locale('commands/start', {
    name: context.update.message.from.username
  })

  context.reply(text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Action start',
            callback_data: queryEncode({
              action: 'actionStart',
              key1: 'value1',
              key2: 'value2',
            })
          },
          {
            text: 'Action help',
            callback_data: queryEncode({
              action: 'actionHelp',
              key1: 'value1',
              key2: 'value2',
            })
          },
        ]
      ]
    }
  })
}