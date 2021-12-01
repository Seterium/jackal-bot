import ytSuggests from 'youtube-suggest'

import logger from '#@/Utils/logger.js'


export default {
  command: 'suggests',

  description: 'Get Youtube search suggests',

  async handler() {
    try {
      const suggests = await ytSuggests('Доктор дью')

      console.log(suggests)
    } catch (error) {
      logger.error(error)
    }
  }
}