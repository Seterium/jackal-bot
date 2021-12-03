import round from 'lodash.round'
import formatCount from '#@/Utils/formatCount.js'

export default count => {
  if (count < 1e3) {
    const countTexts = [
      'просмотр',
      'просмотра',
      'просмотров'
    ]
  
    return formatCount(count, countTexts)
  }

  if (count < 1e6) {
    return `${round(count / 1e3, 1)} тыс. просмотров`
  }

  return `${round(count / 1e6, 1)} млн. просмотров`
}