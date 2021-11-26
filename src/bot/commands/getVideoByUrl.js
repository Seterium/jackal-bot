import qs from 'qs'
import URLParse from 'url-parse'

export default {
  handler (context, { url }) {
    const isFullUrl = url.indexOf('youtube.com') !== -1
    const isShortUrl = url.indexOf('youtu.be') !== -1

    if (!isFullUrl && !isShortUrl) {
      console.log('Not Youtube URL')

      return
    }

    let id
    const { pathname, query } = new URLParse(url)

    try {
      id = isFullUrl
        ? qs.parse(query.substring(1, query.length)).v
        : pathname.substring(1, url.length)
    } catch (error) {
      console.log('Getting ID fron URL error')

      return
    }

    console.log({ id })
  }
}