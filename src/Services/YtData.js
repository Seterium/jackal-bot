import ytcog from 'ytcog'
import miniget from 'miniget'

import formatDuration from '#@/Utils/formatDuration.js'

export default {
  searchTypes: {
    channel: 'EgIQAg%3D%3D',
    video: 'EgIQAQ%3D%3D'
  },

  async getVideo (id) {
    const session = await this.getSession()

    const video = new ytcog.Video(session, {
      id
    })

    await video.fetch()

    const {
      title,
      channelId,
      author,
      duration,
      views,
      rating,
      published,
      // formats
    } = video

    return {
      id,
      title,
      channel: {
        id: channelId,
        title: author
      },
      cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      duration: formatDuration(duration),
      views,
      rating,
      published
    }
  },

  async getChannel(id) {
    const session = await this.getSession()

    const channel = new ytcog.Channel(session, {
      id,
      items: 'videos',
      quantity: 10
    })

    await channel.fetch()

    const {
      author,
      thumbnail,
      videos
    } = channel

    return {
      id,
      title: author,
      thumbnail,
      videos: videos.map(this.mapVideoData)
    }
  },

  async getSession() {
    const {
      USER_AGENT,
      COOKIE
    } = process.env
  
    const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    await session.fetch()

    return session
  },

  async search(query, type, lang = 'ru-RU') {
    const url = new URL('https://www.youtube.com/results')

    url.search = new URLSearchParams({
      search_query: query,
      sp: this.searchTypes[type]
    })

    const result = await miniget(url, {
      headers: {
        'Accept-Language': lang
      }
    }).text()

    const parsedData = this.parseSearchData(result)
    const mappedData = this.mapSearchData(parsedData, type)

    return mappedData
  },

  parseSearchData(input) {
    const startPointer = 'var ytInitialData = '

    const start = input.indexOf(startPointer)
    const end = input.indexOf(';</script>', start)

    const data = input.substring(start + startPointer.length, end)

    let parsed

    try {
      parsed = JSON.parse(data)
    } catch (e) {
      throw new Error('Failed to parse YouTube search data.')
    }

    parsed = parsed.contents.twoColumnSearchResultsRenderer.primaryContents;

    let contents = [];

    if (parsed.sectionListRenderer) {
      contents = parsed.sectionListRenderer.contents
        .filter(item => item?.itemSectionRenderer?.contents
          .filter(x => x.videoRenderer || x.playlistRenderer || x.channelRenderer)
        )
        .shift().itemSectionRenderer.contents;
    }

    if (parsed.richGridRenderer) {
      contents = parsed.richGridRenderer.contents
        .filter(item => item.richItemRenderer && item.richItemRenderer.content)
        .map(item => item.richItemRenderer.content);
    }

    return contents.slice(0, 24)
  },

  mapSearchData(input, type) {
    const enitiesParser = {
      channel: {
        check: ({ channelRenderer }) => typeof channelRenderer !== 'undefined',
        map: ({ channelRenderer }) => this.mapChannelsSearchData(channelRenderer)
      },
      video: {
        check: ({ videoRenderer }) => videoRenderer && videoRenderer.lengthText,
        map: ({ videoRenderer }) => this.mapVideosSearchData(videoRenderer)
      }
    }

    const results = []

    for (const entity of input) {
      if (enitiesParser[type].check(entity)) {
        results.push(enitiesParser[type].map(entity))
      }
    }

    return results
  },

  mapVideosSearchData(raw) {
    const {
      videoId: id,
      ownerText: {
        runs: [
          {
            text: channelTitle,
            navigationEndpoint: {
              browseEndpoint: {
                browseId: channelId
              }
            }
          }
        ]
      },
      title: {
        runs: [
          {
            text: title
          }
        ]
      },
      lengthText: {
        simpleText: durationText
      },
      viewCountText,
      publishedTimeText
    } = raw

    const views = +(viewCountText?.simpleText.replace(/[^0-9]/g, '')) || 0
    const publishedText = publishedTimeText?.simpleText || '-'
    const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    const [ minutes, seconds ] = durationText.split(':')

    return {
      id,
      title,
      channel: {
        id: channelId,
        title: channelTitle
      },
      cover,
      duration: {
        minutes: +minutes,
        seconds: +seconds
      },
      views,
      rating: 0,
      publishedText
    }
  },

  mapChannelsSearchData(raw) {
    const {
      channelId: id,
      title: {
        simpleText: title
      },
      subscriberCountText
    } = raw

    const subscribers = subscriberCountText
      ? subscriberCountText.simpleText
      : 'скрыто'

    return {
      id,
      title,
      subscribers
    }
  }
}