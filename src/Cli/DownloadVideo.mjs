import crypto from 'crypto'

import ytcog from 'ytcog'
import ffmpeg from 'fluent-ffmpeg'

import logger from '#@/Utils/logger.js'

export default {
  command: 'download',

  description: 'Download video from Youtube by ID',

  arguments: [
    {
      name: 'id',
      description: 'Youtube video ID',
      required: true
    }
  ],

  options: [
    {
      name: '-q, --quality <value>',
      description: 'Video quality (default: \'medium\')',
      default: 'medium'
    },
    {
      name: '-c, --compression <value>',
      description: 'Video compression level',
      default: 30
    }
  ],

  async handler (id, { quality, compression }) {
    const {
      USER_AGENT,
      COOKIE
    } = process.env
  
    const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    await session.fetch()
  
    const video = new ytcog.Video(session, {
      id,
    })
  
    const started = Date.now()
  
    let currentProgress = 0

    const path = `${process.env.PWD}/public/results`

    const filename = crypto.randomUUID()

    console.log('Downloading started')

    try {
      await video.download({
        filename: `${quality}.${filename}`,
        path,
        container: 'mp4',
        videoQuality: quality,
        progress: progress => {
          const rounded = Math.round(progress)
          
          if (currentProgress < rounded) {
            currentProgress = rounded
  
            console.log(`Downloading progress: ${Math.round(progress)}`)
          }
        }
      })
      
      console.log('Downloading finished')
    } catch (error) {
      console.log('Video downloading failed')
      logger(error)
    
      return
    }
  
    currentProgress = 0

    console.log('Compressing started')

    try {
      const input = `${path}/${quality}.${filename}.mp4`
      const output = `${path}/compressed.${quality}.${filename}.mp4`

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(input)
          .format('mp4')
          .videoCodec('libx264')
          .outputOptions(`-crf ${compression}`)
          .on('progress', ({ percent }) => {
            if (currentProgress < percent) {
              currentProgress = percent
              
              console.log(`Compression progress: ${Math.round(percent)}`)
            }
          })
          .on('end', resolve)
          .on('error', reject)
          .output(output)
          .run()
      })
    } catch (error) {
      console.log('Compression failed')
      logger(error)
  
      return
    }

    console.log('Compression finished')
  
    console.log(`Total remaining: ${(Date.now() - started) / 1000} s.`)
  }
}