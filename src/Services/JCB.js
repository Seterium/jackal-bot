import * as Sentry from '@sentry/node'

import dayjs from '#@/Utils/dayjs.js'
import logger from '#@/Utils/logger.js'


export default {
  init() {
    const $jcb = {
      log: (text, error = null) => {
        console.log(`[JCB][${dayjs().format('HH:mm:ss DD.MM.YY')}] ${text}`)

        if (error) {
          logger(error)
        }
      }
    }

    global.$jcb = $jcb

    // this.initSentry()
  },

  initSentry() {
    try {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        debug: process.env.DEBUG === '1'
      });

      $jcb.log('Sentry service initialized')
    } catch (error) {
      $jcb.log('Sentry service initialization error', true)

      logger(error)
    }
  }
}