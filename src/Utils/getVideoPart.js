import crypto from 'crypto'

import ffmpeg from 'fluent-ffmpeg'

export default async (video, start, end) => {
  const filename = crypto.randomUUID()
  const output = `${process.env.PWD}/public/results/${filename}.mp4`

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(video)
      .setStartTime(start)
      .setDuration(end - start)
      .withVideoCodec('copy')
      .withAudioCodec('copy')
      .on('end', resolve)
      .on('error', reject)
      .output(output)
      .run()
  })

  return output
}