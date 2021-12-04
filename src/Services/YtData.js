import ytcog from 'ytcog'
import miniget from 'miniget'

import fs from 'fs'

import formatViews from '#@/Utils/formatViews.js'
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

    return this.mapVideoData(video)
  },

  async getVideoFormats (id) {
    const session = await this.getSession()

    const video = new ytcog.Video(session, {
      id
    })

    await video.fetch()

    return video.formats
  },

  async getChannel(id) {
    const session = await this.getSession()

    const channel = new ytcog.Channel(session, {
      id
    })

    await channel.fetch()

    const {
      data,
      author,
      description
    } = channel

    const cover = data[0]?.header.c4TabbedHeaderRenderer?.banner?.thumbnails[0].url

    return {
      id,
      title: author,
      cover,
      description
    }
  },

  async getChannelVideos(id, page) {
    const session = await this.getSession()

    const VIDEOS_PER_PAGE = parseInt(process.env.VIDEOS_PER_PAGE)

    const channel = new ytcog.Channel(session, {
      id,
      items: 'videos',
      quantity: page * VIDEOS_PER_PAGE > 60 ? page * VIDEOS_PER_PAGE : 60
    })

    await channel.fetch()

    const {
      author,
      videos: videosRaw
    } = channel

    const sliceStart = (page - 1) * VIDEOS_PER_PAGE

    const videos = videosRaw.slice(sliceStart, sliceStart + VIDEOS_PER_PAGE).map(this.mapVideoData)

    return {
      id,
      title: author,
      videos,
      count: videos.length
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

  mapVideoData(video, key) {
    const {
      id,
      title,
      channelId,
      author,
      duration,
      views,
      rating,
      published,
    } = video

    return {
      id,
      key: key + 1,
      title,
      channel: {
        id: channelId,
        title: author
      },
      cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      duration: formatDuration(duration, 'full'),
      views: formatViews(views),
      rating,
      published
    }
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
        map: ({ channelRenderer }, key) => this.mapChannelsSearchData(channelRenderer, key)
      },
      video: {
        check: ({ videoRenderer }) => videoRenderer && videoRenderer.lengthText,
        map: ({ videoRenderer }, key) => this.mapVideosSearchData(videoRenderer, key)
      }
    }

    const results = []

    for (const entity of input) {
      if (enitiesParser[type].check(entity)) {
        results.push(enitiesParser[type].map(entity, results.length + 1))
      }
    }

    return results
  },

  mapVideosSearchData(raw, key) {
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
        simpleText: duration
      },
      viewCountText,
      publishedTimeText
    } = raw

    const views = +(viewCountText?.simpleText.replace(/[^0-9]/g, '')) || 0
    const uploaded = publishedTimeText?.simpleText || '-'
    const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

    return {
      id,
      key,
      title,
      channel: {
        id: channelId,
        title: channelTitle
      },
      cover,
      duration,
      views: views ? formatViews(views) : 'неизвестно',
      uploaded
    }
  },

  mapChannelsSearchData(raw, key) {
    const {
      channelId: id,
      title: {
        simpleText: title
      },
      subscriberCountText
    } = raw

    const subscribers = subscriberCountText
      ? subscriberCountText.simpleText
      : 'Число подписчиков скрыто'

    return {
      id,
      key,
      title,
      subscribers
    }
  }
}