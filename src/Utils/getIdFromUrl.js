const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/

const validQueryDomains = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'gaming.youtube.com',
])

const validId = /^[a-zA-Z0-9-_]{11}$/

export default link => {
  const parsed = new URL(link)

  let id = parsed.searchParams.get('v')

  if (validPathDomains.test(link) && !id) {
    const paths = parsed.pathname.split('/')

    id = parsed.host === 'youtu.be' 
      ? paths[1]
      : paths[2]

  } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
    throw 'notValidUrl'
  }

  if (!id) {
    throw 'idNotFound'
  }

  id = id.substring(0, 11)

  if (!validId.test(id)) {
    throw 'idInvalid'
  }

  return id
}