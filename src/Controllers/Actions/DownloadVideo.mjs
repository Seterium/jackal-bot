import YtData from '#@/Services/YtData.js'

import getLocale from '#@/Utils/getLocale.js'

export default {
  action: 'downloadVideo',

  params: {
    id: {
      type: 'string',
      required: true
    }
  },

  async handler(context, { id, quality, compression }) {}
}