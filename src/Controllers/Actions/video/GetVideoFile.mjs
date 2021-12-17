import fs from 'fs'

import Controller from '#@/Controllers/Controller.js'

import getVideoPartsTiming from '#@/Utils/getVideoPartsTiming.js'
import compressVideo from '#@/Utils/compressVideo.js'
import getVideoPart from '#@/Utils/getVideoPart.js'

class GetVideoFile extends Controller {
  action = 'getVideoFile'

  locales = 'video'

  params = {
    id: {
      type: 'string',
      required: true
    },
    quality: {
      type: 'string',
      required: true
    },
    compression: {
      type: 'number',
      default: 0
    }
  }

  noAutoanswer = true

  async handler(context, { id, quality, compression }) {
    // if (context.update.callback_query.from.id !== 14112294) {
    //   return context.answerCbQuery('На время альфа-тестирования скачивание видео недоступно', {
    //     show_alert: true
    //   })
    // }

    let name
    let duration

    try {
      const { title, durationRaw } = await this.$yt.getVideo(id)

      name = title
      duration = durationRaw
    } catch (error) {
      return context.reply(this.$loc('errors/unableGetVideo'))
    }

    const progressbar = new Array(10).fill('⬜️').join('')

    const initMessageText = this.$loc('progress', {
      downloading: {
        percent: '0',
        progressbar
      },
      compression: {
        percent: '0',
        progressbar
      }
    })

    const initMessage = await context.reply(initMessageText, {
      parse_mode: 'HTML'
    })

    const {
      message_id: messageId,
      chat: {
        id: chatId
      }
    } = initMessage

    let downloadPercent = 0

    const downloadingProgress = progress => {
      const roundedProgress = Math.round(progress)

      if (roundedProgress % 10 === 0 && roundedProgress > downloadPercent) {
        downloadPercent = roundedProgress

        const text = this.$loc('progress', {
          downloading: {
            percent: downloadPercent,
            progressbar: [
              ...new Array(downloadPercent / 10).fill('🟩'),
              ...new Array((100 - downloadPercent) / 10).fill('⬜️')
            ].join('')
          },
          compression: {
            percent: '0',
            progressbar: '⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️'
          }
        })

        $jcb.log(`Downloading video ID:${id} (q:${quality}, c:${compression}), progress: ${downloadPercent}%`)

        context.tg.editMessageText(chatId, messageId, null, text, {
          parse_mode: 'HTML'
        })
      }
    }

    let downloaded

    try {
      downloaded = await this.$yt.downloadVideo(id, quality, downloadingProgress)
    } catch (error) {
      return context.reply(this.$loc('errors/unableGetVideo'))
    }

    let optimizedPercent = 0

    const compressingProgress = ({ percent }) => {
      const roundedProgress = Math.round(percent)

      if (roundedProgress % 10 === 0 && roundedProgress > optimizedPercent) {
        optimizedPercent = roundedProgress

        const text = this.$loc('progress', {
          downloading: {
            percent: 100,
            progressbar: new Array(10).fill('🟩').join('')
          },
          compression: {
            percent: optimizedPercent,
            progressbar: [
              ...new Array(optimizedPercent / 10).fill('🟩'),
              ...new Array((100 - optimizedPercent) / 10).fill('⬜️')
            ].join('')
          }
        })

        $jcb.log(`Compressing video ID:${id} (q:${quality}, c:${compression}), progress: ${optimizedPercent}%`)

        context.tg.editMessageText(chatId, messageId, null, text, {
          parse_mode: 'HTML'
        })
      }
    }

    let optimized

    try {
      optimized = await compressVideo(downloaded, compression, compressingProgress)
    } catch (error) {
      return context.reply(this.$loc('errors/unableOptimizeVideo'))
    }

    fs.unlinkSync(downloaded)

    const { size } = fs.statSync(optimized)

    if (size > process.env.MAX_VIDEO_FILESIZE) {
      const parts = getVideoPartsTiming(size, duration)

      for (let index = 0; index < parts.length; index += 1) {
        const { start, end } = parts[index];

        const video = await getVideoPart(optimized, start, end)

        await context.replyWithVideo({ source: fs.createReadStream(video) }, {
          thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          disable_notification: Boolean(index),
          caption: this.$loc('part', {
            name,
            current: index + 1,
            total: parts.length
          }),
          parse_mode: 'HTML'
        })

        fs.unlinkSync(video)
      }
    } else {
      await context.replyWithVideo({ source: fs.createReadStream(optimized) }, {
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        caption: this.$loc('index', {
          name
        }),
        parse_mode: 'HTML'
      })
    }

    fs.unlinkSync(optimized)
  }
}

export default new GetVideoFile