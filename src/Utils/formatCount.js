export default (n, titles, insertCount = true) => {
  const cases = [2, 0, 1, 1, 1, 2]
  const index = (n % 100 > 4 && n % 100 < 20)
    ? 2
    : cases[(n % 10 < 5) ? n % 10 : 5]

  
  return insertCount 
    ? `${n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} ${titles[index]}`
    : titles[index]
}