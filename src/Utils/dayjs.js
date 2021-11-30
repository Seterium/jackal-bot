import dayjs from 'dayjs'

import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import updateLocale from 'dayjs/plugin/updateLocale.js'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(updateLocale)

dayjs.tz.setDefault('Europe/Kaliningrad')

dayjs.updateLocale('en', {
  monthsShort: [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сент',
    'окт',
    'нояб.',
    'дек.'
  ]
})

export default dayjs