import fs from 'fs'
import mustache from 'mustache'

export default (path, params = null) => {
  const template = fs.readFileSync(`${process.env.PWD}/src/locales/${path}.html`, {
    encoding: 'utf8',
    flag: 'r'
  })

  if (!params) {
    return template
  }

  return mustache.render(template, params)
}