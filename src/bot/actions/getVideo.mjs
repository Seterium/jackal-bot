import ytdl from 'ytdl-core'

import dayjs from '#@/utils/helpers/dayjs.js'
import getLocale from '#@/utils/helpers/getLocale.js'
import formatCount from '#@/utils/helpers/formatCount.js'

export default {
  name: 'getVideo',
  
  async handler (context, [ id ]) {
    const { 
      videoDetails: {
        videoId,
        title,
        averageRating,
        allowRatings,
        likes,
        dislikes,
        viewCount,
        uploadDate,
        author,
        lengthSeconds
      }
    } = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`)

    const ratingsIcons = [ '🟫', '🟥', '🟧', '🟩', '🟩' ]

    const rating = allowRatings
      ? `${ratingsIcons[Math.trunc(averageRating)]} ${averageRating.toFixed(2)}`
      : '⬛️ ???'

    const viewsCount = formatCount(viewCount, [
      'просмотр',
      'просмотра',
      'просмотров'
    ])

    const minutesCount = formatCount(Math.trunc(+lengthSeconds / 60), [
      'минута',
      'минуты',
      'минут'
    ])

    const secondsCount = formatCount(+lengthSeconds % 60, [
      'секунда',
      'секунды',
      'секунд'
    ])
    
    const duration = `${minutesCount} ${secondsCount}`

    const uploaded = dayjs(uploadDate, 'YYYY-MM-DD').format('DD MMM. YYYY')

    const text = getLocale('actions/getVideo/index', {
      title,
      author,
      duration,
      rating,
      likes,
      dislikes: dislikes ? dislikes : 'X',
      viewsCount,
      uploaded
    })

    const keyboard = [
      [
        {
          text: '➕ Сохранить канал',
          callback_data: `saveChannel|${author.id}`
        },
        // {
        //   text: '❌ Убрать из сохраненных каналов',
        //   callback_data: `removeSavedChannel|${author.id}`
        // },
        {
          text: '📦 Скачать видео',
          callback_data: `downloadVideo|${author.id}`
        }
      ],
      [
        {
          text: `➕ Другие видео с канала "${author.name}"`,
          callback_data: `getChannel|${author.id}`
        },
      ]
    ]

    const cover = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    
    await context.replyWithPhoto(cover, {
      caption: text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }
}