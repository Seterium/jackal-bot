import dotenv from 'dotenv'

import JackalBot from '#@/bot/JackalBot.js'

dotenv.config()

const jackal = new JackalBot()

jackal.command('start', 'getStart')
jackal.command('help', 'getHelp')
jackal.command('channels', 'getChannels')
jackal.command('search', 'getSearchResults')
jackal.command('url', 'getVideoByUrl', [ 'url' ])

jackal.action('getChannel')
jackal.action('getVideo')