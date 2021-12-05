import filesize from 'filesize'

import YtData from '#@/Services/YtData.js'

import logger from '#@/Utils/logger.js'
import groupBy from 'lodash.groupby'

import { formatsFilter } from '#@/constants.js'

import formatSubscribersCount from '#@/Utils/formatSubscribersCount.js'

export default {
  command: 'test',

  description: 'Feature testing command',

  async handler () {
    console.log(formatSubscribersCount('1 subscriber'))
    console.log(formatSubscribersCount('2 subscribers'))
    console.log(formatSubscribersCount('324 subscribers'))
    console.log(formatSubscribersCount('67.6K subscribers'))
    console.log(formatSubscribersCount('67.6M subscribers'))
    // try {
    //   const formats = await YtData.getVideoFormats('qRst1tEWA1Y')

    //   const filtered = formats.filter(({ itag, quality, mimeType }) => {
    //     const [ mime ] = mimeType.split('; ')

    //     return formatsFilter.includedQuality.includes(quality) 
    //       && formatsFilter.includedMime.includes(mime)
    //       && !formatsFilter.excludedItags.includes(itag)
    //   })
      
    //   const mapped = filtered.map(({ url, itag, mimeType, contentLength, quality, qualityLabel  }) => ({
    //     url,
    //     itag,
    //     mimeType,
    //     contentLength: parseInt(contentLength),
    //     size: filesize(parseInt(contentLength), {
    //       round: 0,
    //     }),
    //     quality,
    //     qualityLabel
    //   }))

    //   const grouped = groupBy(mapped, 'quality')

    //   for (const quality in grouped) {
    //     grouped[quality] = grouped[quality].sort((x1, x2) => x2.contentLength - x1.contentLength)
    //   }

    //   console.log(grouped)
    // } catch (error) {
    //   logger(error)
    // }
  }
}