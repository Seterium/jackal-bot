import formatCount from './formatCount.js'

export default subscribersString => {
  const [ subscribersCount ] = subscribersString.split(' ')

  const counterMark = subscribersString[subscribersCount.length - 1]
  
  if (counterMark === 'M') {
    const subscribers = subscribersCount.substring(0, subscribersCount.length - 1)

    return `${subscribers} млн. подписчиков`
  }

  if (counterMark === 'K') {
    const subscribers = subscribersCount.substring(0, subscribersCount.length - 1)

    return `${subscribers} тыс. подписчиков`
  }

  return formatCount(parseInt(subscribersCount), [
    'подписчик',
    'подписчика',
    'подписчиков'
  ])
}