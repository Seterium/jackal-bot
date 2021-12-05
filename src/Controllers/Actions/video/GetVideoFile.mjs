import fs from 'fs'

import Controller from '#@/Controllers/Controller.js'

import compressVideo from '#@/Utils/compressVideo.js'

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
    if (context.update.callback_query.from.id !== 14112294) {
      return context.answerCbQuery('На время альфа-тестирования скачивание видео недоступно', {
        show_alert: true
      })
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

    const video = {
      source: fs.createReadStream(optimized)
    }

    context.replyWithVideo(video, {
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      caption: this.$loc(),
      parse_mode: 'HTML'
    })
  }
}

export default new GetVideoFile