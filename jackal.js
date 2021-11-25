import dotenv from 'dotenv'
import JackalBot from '#@/bot/JackalBot.js'

dotenv.config()

const jackal = new JackalBot()

jackal.command('start')
jackal.command('help')
jackal.command('channels')

jackal.action('actionStart')
jackal.action('actionHelp')