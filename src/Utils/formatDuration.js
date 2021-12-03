import formatCount from '#@/Utils/formatCount.js'

export default (duration, format = null) => {
  const minutes = Math.trunc(duration / 60);
  const seconds = duration % 60

  switch (format) {
    case 'short':
      return `${minutes}:${seconds}`

    case 'full':
      const minutesFormated = formatCount(Math.trunc(duration / 60), [
        'минута',
        'минуты',
        'минут'
      ])
  
      const secondsFormated = formatCount(duration % 60, [
        'секунда',
        'секунды',
        'секунд'
      ])
      
      return `${minutesFormated} ${secondsFormated}`
  
    default:
      return { 
        minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds 
      }
  }
}