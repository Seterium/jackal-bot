export default ({ current, total, next, prev }, action, params = []) => {
  const controls = [
    {
      text: '⬅️',
      callback_data: [
        action,
        params.join('|'),
        +(current) - 1,
        prev
      ].join('|')
    },
    {
      text: '➡️',
      callback_data: [
        action,
        params.join('|'),
        +(current) + 1,
        next
      ].join('|')
    }
  ]

  if (current === 1) {
    controls.shift()
  }

  if (current > 1 && current === total) {
    controls.pop()
  }

  return controls
}