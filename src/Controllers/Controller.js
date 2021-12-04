import YtData from '#@/Services/YtData.js'

import getLocale from '#@/utils/getLocale.js'

export default class Controller {
  $yt = YtData

  $loc (shortPath = 'index', params = {}) {
    const path = this.locales ? `${this.locales}/` : ''
    const type = this.action ? 'Actions' : 'Commands'
    const className = this.constructor.name

    return getLocale(`${type}/${path}${className}/${shortPath}`, params)
  }
}