import getLocale from '#@/utils/getLocale.js'

export default {
  command: 'url',

  params: {
    url: {
      type: 'string',
      required: true
    }
  },

  validate(context, { url }) {},
  
  async handler (context, { url }) {}
}