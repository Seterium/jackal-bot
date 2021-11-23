import { Command } from 'commander/esm.mjs';

import fs from 'fs'
import ytdl from 'ytdl-core'
import cliProgress from 'cli-progress'
import ffmpeg from 'fluent-ffmpeg'
import { execa } from 'execa'
import { v4 as uuid } from 'uuid'
import { google } from 'googleapis'
import getYouTubeIdByUrl from '@gonetone/get-youtube-id-by-url'
import mustache from 'mustache';

const program = new Command()

program
  .command('download')
  .argument('[url]', 'Video URL')
  .description('Download Youtube video')
  .action(async (url) => {
    const multibar = new cliProgress.MultiBar({
      clearOnComplete: false,
      hideCursor: false
    }, cliProgress.Presets.rect);

    const videoStatus = multibar.create(0, 0, {
      stopOnComplete: true,
      filename: 'video.mp4'
    })

    const video = ytdl(url, { quality: '134' })
      .on('info', (_, { contentLength }) => videoStatus.setTotal(parseInt(contentLength)))
      .on('data', ({ length }) => videoStatus.increment(length))
      .on('end', () => videoStatus.stop())
    
    video.pipe(fs.createWriteStream('video.mp4'))

    const audioStatus = multibar.create(0, 0, {
      stopOnComplete: true,
      filename: 'audio.mp4'
    })

    const audio = ytdl(url, { quality: '249' })
      .on('info', (_, { contentLength }) => audioStatus.start(parseInt(contentLength), 0))
      .on('data', ({ length }) => audioStatus.increment(length))
      .on('end', () => audioStatus.stop())
    
    audio.pipe(fs.createWriteStream('audio.mp4'))
  })

program
  .command('merge')
  .description('Merge audio and video')
  .action(() => {
    ffmpeg()
      .addInput(fs.createReadStream('video.mp4'))
      .addInput('audio.mp4')
      .format('mp4')
      .outputOptions('-movflags frag_keyframe+empty_moov')
      .pipe(fs.createWriteStream('result.mp4'))
      .on('end', () => console.log('Merged'))
  })

program
  .command('compress')
  .option('-rt, --rate <rate>', 'Compression rate (default: 30)')
  .description('Compress video')
  .action(async (options) => {
    const compressionRate = options.rate || 30
    
    console.log(`Compression rate: ${compressionRate}`)

    try {
      const command = `ffmpeg -i uncompressed.mp4 -vcodec libx264 -strict -2 -crf ${compressionRate} compressed_${compressionRate}.mp4`;

      const startTime = Date.now()

      await execa(command)

      const duration = Math.round((Date.now() - startTime) / 1000)

      console.log(`Completed in ${duration} second(s)`)
    } catch (error) {
      console.log(error)
    }
  })

program
  .command('jackal')
  .argument('[url]', 'Video URL')
  .description('Download \'Jackal\' Youtube video via link')
  .action(async (url) => {
    const files = {
      video: `./public/temp/${uuid()}.mp4`,
      audio: `./public/temp/${uuid()}.mp4`,
      merged: `./public/temp/${uuid()}.mp4`,
      result: `./public//${uuid()}.mp4`,
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
          // .addInput(fs.createReadStream('video.mp4'))
          // .addInput('audio.mp4')
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
      await execa(`ffmpeg -i ${files.merged} -vcodec libx264 -strict -2 -crf 35 ${files.result}`)
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
  })

program
  .command('yt-list')
  .option('-i, --ids <ids...>', 'Channels ids')
  .description('Get Youtube channels data')
  .action(async ({ ids }) => {
    if (!ids) {
      console.log('Channels ids not specified')

      return
    }

    const client = google.youtube('v3')

    try {
      const { data } = await client.channels.list({
        auth: process.env.GOOGLE_API_TOKEN,
        id: ids,
        part: [
          'snippet',
        ]
      })

      const mapped = data.items.map(({ id, snippet }) => {
        const {
          title,
          thumbnails: {
            medium: {
              url
            }
          }
        } = snippet

        return {
          id,
          title,
          url
        }
      })

      console.log(mapped)
    } catch (error) {
      console.log(error)
    }
  })

program
  .command('yt-last')
  .argument('[id]', 'Channel ID')
  .description('Get last videos from Youtube channel')
  .action(async (id) => {
    const client = google.youtube('v3')

    try {
      const { data } = await client.search.list({
        auth: process.env.GOOGLE_API_TOKEN,
        channelId: id,
        order: 'date',
        part: [
          'snippet'
        ]
      })

      const mapped = data.items.map(({id, snippet }) => {
        const { videoId } = id

        const {
          publishedAt,
          title,
          thumbnails: {
            medium: {
              url
            }
          }
        } = snippet

        return {
          id: videoId,
          title,
          publishedAt: new Date(publishedAt).getTime(),
          image: url
        }
      })

      console.log(mapped)
    } catch (error) {
      console.log(error)
    }
  })

program
  .command('yt-id')
  .argument('[url]', 'Channel URL')
  .description('Get Youtube channel ID by URL')
  .action(async (url) => {
    let username = url.split('/').pop()

    if (/^[\u0400-\u04FF]+$/.test(username)) {
      username = encodeURIComponent(username)
    }

    try {
      const id = await getYouTubeIdByUrl.channelId(`https://www.youtube.com/c/${username}`)

      console.log(`\r\nChannel ID: ${id}`)
    } catch (error) {
      console.log(error)
    }
  })

program
  .command('test')
  .description('Features testing command')
  .action(async () => {
    const template = fs.readFileSync(`${process.env.PWD}/locales/start.html`, {
      encoding: 'utf8',
      flag: 'r'
    })

    const message = mustache.render(template, {
      username: 'Leo'
    })

    console.log(message)
  })

program.parse(process.argv)