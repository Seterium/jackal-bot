export default () => {
  const source = `${process.env.PWD}/public/video.mp4`

  const { format } = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(source, (error, meta) => {
      if (error) {
        reject(error)
      }

      resolve(meta)
    })
  })

  const { duration } = format

  // Main splitting arg
  const maxDuration = 60

  const partsCount = Math.ceil(duration / maxDuration)
  const lastPartLength = +(duration - ((partsCount - 1) * maxDuration)).toFixed(3)

  console.log()
  console.log(`Source duration: ${duration} s.`)
  console.log(`Split size: ${maxDuration} s.`)
  console.log(`Parts count: ${partsCount}`)
  console.log(`Last part length: ${lastPartLength} s.`)
  console.log()

  for (let i = 0; i < partsCount; i += 1) {
    const start = i * maxDuration
    const duration = i + 1 === partsCount
      ? lastPartLength
      : maxDuration

    await new Promise(resolve => {
      ffmpeg(source)
        .setStartTime(start)
        .setDuration(duration)
        .output(`${process.env.PWD}/public/splitted/part-${i + 1}.mp4`)
        .on('end', () => resolve())
        .on('error', console.log)
        .run()
    })

    console.log(`Done [${i + 1}/${partsCount}]`)
  }
}