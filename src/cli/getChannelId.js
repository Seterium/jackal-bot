import getYouTubeIdByUrl from '@gonetone/get-youtube-id-by-url'
import logger from '#@/utils/helpers/logger.js'

export default async (url) => {
  const splittedUrl = url.split('/')

  let usertag = splittedUrl.pop()
  const usertagType = splittedUrl.pop()

  if (/^[\u0400-\u04FF]+$/.test(usertag)) {
    usertag = encodeURIComponent(usertag)
  }

  const requestUrl = `https://www.youtube.com/${usertagType}/${usertag}`

  try {
    const id = await getYouTubeIdByUrl.channelId(requestUrl)

    console.log(`Channel ID: ${id}`)
  } catch (error) {
    logger(error)
  }
}