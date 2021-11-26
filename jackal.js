import dotenv from 'dotenv'
import JackalBot from '#@/bot/JackalBot.js'

dotenv.config()

const jackal = new JackalBot()

jackal.command('start', 'getStart')
jackal.command('help', 'getHelp')
jackal.command('channels', 'getChannels')

jackal.command('url', 'getVideoByUrl', [
  'url'
])

jackal.command('search', 'getSearchResults')

// jackal.action('actionStart')
// jackal.action('actionHelp')