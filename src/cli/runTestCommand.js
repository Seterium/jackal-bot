import { google } from 'googleapis'
import dayjs from '#@/utils/helpers/dayjs.js'

export default async () => {
  const { data } = await google.youtube('v3').search.list({
    auth: process.env.GOOGLE_API_TOKEN,
    part: 'snippet',
    type: 'video',
    maxResults: 10,
    videoCaption: 'any',
    q: 'Rage 2',
    videoDimension: '2d'
  })

  const mapped = data.items.map(({ id, snippet }) => ({
    video: {
      id: id.videoId,
      title: snippet.title
    },
    channel: {
      id: snippet.channelId,
      title: snippet.channelTitle,
    },
    published: dayjs.utc(snippet.publishedAt).format('DD.MM.YYYY HH:mm'),
  }))

  console.log(mapped)
}