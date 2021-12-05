import YtData from '#@/Services/YtData.js'
import JackalBot from '#@/Services/JackalBot.js'

import getLocale from '#@/utils/getLocale.js'

export default class Controller {
  $yt = YtData

  $jc = JackalBot

  $loc (shortPath = 'index', params = {}) {
    const path = this.locales ? `${this.locales}/` : ''
    const type = this.action ? 'Actions' : 'Commands'
    const className = this.constructor.name

    return getLocale(`${type}/${path}${className}/${shortPath}`, params)
  }
}