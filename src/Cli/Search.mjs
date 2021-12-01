import youtube from '@yimura/scraper'
import logger from '#@/Utils/logger.js'

export default {
  command: 'search',

  description: 'Search Youtube video',

  arguments: [],

  async handler () {
    const instance = new youtube.default()

    try {
      const result = await instance.search('Доктор Дью', {
        language: 'ru-RU',
        searchType: 'video'
      })

      console.log(result)
    } catch (error) {
      logger(error)
    }

    // const {
    //   USER_AGENT,
    //   COOKIE
    // } = process.env
  
    // const session = new ytcog.Session(USER_AGENT, COOKIE)
  
    // await session.fetch()

    // const search = new ytcog.Search(session, {
    //   query: 'Доктор Дью',
    //   items: 'videos'
    // })

    // await search.fetch()

    // console.log(search.videos.length)
  }
}