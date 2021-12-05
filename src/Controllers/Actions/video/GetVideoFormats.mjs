import Controller from '#@/Controllers/Controller.js'

import { availableQualities } from '#@/constants.js'

class GetVideoFormats extends Controller {
  action = 'getVideoFormats'

  locales = 'video'

  params = {
    id: {
      type: 'string',
      required: true
    }
  }

  async handler (context, { id }) {
    const keyboard = availableQualities.map(({ quality, compressions }) => {
      const buttons = [{
        text: quality,
        callback_data: `getVideoFile|${id}|${quality}`
      }]

      if (compressions.length) {
        compressions.forEach(compression => {
          buttons.push({
            text: `${quality}+C${compression}`,
            callback_data: `getVideoFile|${id}|${quality}|${compression}`
          })
        })
      }

      return buttons
    })

    keyboard.push([{
      text: '◀️ Назад к видео',
      callback_data: 'removePrevMessage'
    }])

    context.reply(this.$loc(), {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }
}

export default new GetVideoFormats