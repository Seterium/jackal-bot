import crypto from 'crypto'

import ytcog from 'ytcog'
import ffmpeg from 'fluent-ffmpeg'

export default {
  command: 'test',

  description: 'Feature testing command',

  async handler () {
    const {
      USER_AGENT,
      COOKIE
    } = process.env
  
    const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    await session.fetch()
  
    // Video download
    const video = new ytcog.Video(session, {
      id: 'bjwi3Uoc0Uw',
    })
  
    const started = Date.now()
  
    let currentProgress = 0

    const path = `${process.env.PWD}/public/results`

    const filename = crypto.randomUUID()
    const videoQuality = 'medium'
    const compression = 35

    console.log('Downloading started')
  
    await video.download({
      filename: `${videoQuality}.${filename}`,
      path,
      container: 'mp4',
      videoQuality,
      progress: progress => {
        const rounded = Math.round(progress)
        
        if (currentProgress < rounded) {
          currentProgress = rounded

          console.log(`Downloading progress: ${Math.round(progress)}`)
        }
      }
    })

    console.log('Downloading finished')

    currentProgress = 0

    console.log('Compressing started')

    try {
      const input = `${path}/${videoQuality}.${filename}.mp4`
      const output = `${path}/compressed.${videoQuality}.${filename}.mp4`

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
      console.log(error)
  
      return
    }

    console.log('Compression finished')
  
    console.log(`Total remaining: ${(Date.now() - started) / 1000} s.`)
  
    // ----------------------------
  
    // Get video rearch results by query
    // const search = new ytcog.Search(session, {
    //   query: 'самоделк и лайвхаки',
    //   items: 'videos'
    // })
  
    // await search.fetch()
  
    // console.log(search.videos)
  
    // ----------------------------
  
    // Get videos from channel
    // const channel = new ytcog.Channel(session, {
    //   id: 'UCsJR1qQDNyFvsX_9_bNM63A',
    //   items: 'videos',
    //   quantity: 30
    // })
  
    // await channel.fetch()
  
    // console.log(channel.videos)
  }
}