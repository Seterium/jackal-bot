import qs from 'qs'

export default ({ action, ...payload }) => qs.stringify({
  a: action,
  ...payload
})