import fs from 'fs'
import crypto from 'crypto'
import ytdl from 'ytdl-core'
import { execa } from 'execa'
import ffmpeg from 'fluent-ffmpeg'

export default url => {
  const files = {
    video: `${process.env.PWD}/public/temp/${crypto.randomUUID()}.mp4`,
    audio: `${process.env.PWD}/public/temp/${crypto.randomUUID()}.mp4`,
    merged: `${process.env.PWD}/public/temp/${crypto.randomUUID()}.mp4`,
    result: `${process.env.PWD}/public/results/${crypto.randomUUID()}.mp4`,    
  }

  const started = Date.now()

  const timer = {
    _started: 0,
    _action: null,

    start: function(action) {
      this._action = action
      this._started = Date.now()

      console.log(`${action} started`)
    },
    stop: function() {
      const duration = Math.round((Date.now() - this._started) / 1000)

      console.log(`${this._action} completed in ${duration} s.`)
    }
  }

  const removeFiles = async (files) => {
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]

      try {
        await new Promise((resolve, reject) => {
          fs.unlink(file, (error) => {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          })
        })
      } catch (error) {
        throw error
      } 
    }
  }

  timer.start('Downloading')
  try {
    await Promise.all([
      new Promise((resolve, reject) => {
        ytdl(url, { quality: '134' })
          .on('finish', resolve)
          .on('error', reject)
          .pipe(fs.createWriteStream(files.video))
      }),
      new Promise((resolve, reject) => {
        ytdl(url, { quality: '249' })
          .on('finish', resolve)
          .on('error', reject)
          .pipe(fs.createWriteStream(files.audio))
      }),
    ])
  } catch (error) {
    console.log('Downloading failed')
    console.error(error)
    
    return
  }
  timer.stop()

  timer.start('Merging')
  try {
    await new Promise((resolve, reject) => {
      ffmpeg()
        .addInput(fs.createReadStream(files.video))
        .addInput(files.audio)
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .on('end', resolve)
        .on('error', reject)
        .pipe(fs.createWriteStream(files.merged))
    })
  } catch (error) {
    console.log('Merging failed')
    console.error(error)

    return
  }
  timer.stop()
  
  try {
    console.log('Audio and video tracks files removing')

    await removeFiles([
      files.video,
      files.audio
    ])

    console.log('Audio and video tracks files removed')
  } catch (error) {
    console.log('Audio and video tracks files removing error')
    console.error(error)

    return
  }
  
  timer.start('Compression')
  try {
    await execa(`ffmpeg -i ${files.merged} -vcodec libx264 -strict -2 -crf 30 ${files.result}`)
  } catch (error) {
    console.log('Compression failed')
    console.error(error)

    return
  }
  timer.stop()

  try {
    console.log('Temp file removing')

    await removeFiles([
      files.merged
    ])
  } catch (error) {
    console.log('Temp file removing failed')
    console.error(error)

    return
  }

  const total = Math.round((Date.now() - started) / 1000)

  console.log(`Jackal sequence completed in ${total} s.`)
}