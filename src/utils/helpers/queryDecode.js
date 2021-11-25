import qs from 'qs'

export default query => {
  const { a: action, ...payload } = qs.parse(query)

  return {
    action,
    payload
  }
}