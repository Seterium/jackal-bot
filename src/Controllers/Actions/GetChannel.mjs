import ytch from 'yt-channel-info'

import getLocale from '#@/Utils/getLocale.js'

export default {
  name: 'getChannel',

  async handler (context, [ id ]) {
    const { author, authorBanners, description = '' } = await ytch.getChannelInfo(id)
    const { items } = await ytch.getChannelVideos(id)

    const cover = authorBanners.find(({ width, height }) => width === 1060 && height === 175)?.url

    const text = getLocale('actions/getChannel/index', {
      author,
      description: description.length >= 1024
        ? `${description.slice(0, 1020)} ...`
        : description
    })

    const keyboard = items.slice(0, 12).map(({ videoId, title }) => {
      return [
        {
          text: title,
          callback_data: `getVideo|${videoId}`
        }
      ]
    })

    if (cover) {
      context.replyWithPhoto(cover, {
        caption: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard
        }
      })
    } else {
      context.reply(text, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard
        }
      })
    }
  },
}