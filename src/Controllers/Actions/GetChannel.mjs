import YtData from '#@/Services/YtData.js'

import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'getChannel',

  noAutoanswer: true,

  async handler(context, [ id ]) {
    let channel

    context.answerCbQuery('⚙️ Загрузка канала')

    try {
      channel = await YtData.getChannel(id)
    } catch (error) {
      context.reply(getLocale('actions/getChannel/errors/fatal'))

      return
    }

    const message = getLocale('actions/getChannel/index', {
      ...channel,
      description: channel.description.length > 960 
        ? `${channel.description.slice(0, 960)} ...`
        : channel.description
    })

    const keyboard = [
      [
        {
          text: '➕ Подписаться',
          callback_data: `subscribeChannel|${id}`
        },
        // {
        //   text: '➖ Отписаться',
        //   callback_data: `subscribeChannel|${id}`
        // },

        // {
        //   text: '🔔 Уведомления вкл.',
        //   callback_data: `enableChannelNotify|${id}`
        // },
        {
          text: '🔕 Уведомления выкл',
          callback_data: `disableChannelNotify|${id}`
        }
      ],
      [
        {
          text: '🎬 Видео',
          callback_data: `getChannelVideos|${id},1`
        }
      ]
    ]

    const params = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    }

    if (channel.cover) {
      context.replyWithPhoto(channel.cover, {
        caption: message,
        ...params
      })
    } else {
      context.reply(message, {
        ...params
      })
    }
  },
}