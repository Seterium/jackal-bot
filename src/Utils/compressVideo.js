import crypto from 'crypto'

import ffmpeg from 'fluent-ffmpeg'

export default async (video, compression, progress) => {
  const filename = crypto.randomUUID()
  const output = `${process.env.PWD}/public/results/${filename}.mp4`

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(video)
      .format('mp4')
      .videoCodec('libx264')
      .outputOptions(`-crf ${compression}`)
      .on('progress', progress)
      .on('end', resolve)
      .on('error', reject)
      .output(output)
      .run()
  })

  return output
}