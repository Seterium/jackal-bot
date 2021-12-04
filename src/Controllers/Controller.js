import YtData from '#@/Services/YtData.js'

import getLocale from '#@/utils/getLocale.js'

export default class Controller {
  $yt = YtData

  _type = this.action ? 'Actions' : 'Commands'

  $loc (shortPath = 'index', params = {}) {
    const path = this.locales ? `${this.locales}/` : ''
    const className = this.constructor.name

    return getLocale(`${this._type}/${path}${className}/${shortPath}`, params)
  }
}