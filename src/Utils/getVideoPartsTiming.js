export default (size, duration, maxPartSize = process.env.MAX_VIDEO_FILESIZE) => {
  const partsCount = Math.ceil(size / maxPartSize)
  const partDuration = Math.round((duration / partsCount))

  return new Array(partsCount).fill(0).map((_, index) => ({
    start: index * partDuration,
    end: index + 1 === partsCount
      ? duration
      : (index + 1) * partDuration
  }))
}