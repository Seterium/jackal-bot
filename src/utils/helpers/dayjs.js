import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('Europe/Kaliningrad')

export default dayjs