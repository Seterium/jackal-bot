import { Telegram } from 'telegraf'
import logger from '#@/Utils/logger.js'

import { commands } from '#@/constants.js'

export default {
  command: 'set-commands',

  description: 'Update bot commands list from utils/contants file',
  
  async handler () {
    const bot = new Telegram(process.env.BOT_TOKEN)
  
    try {
      await bot.setMyCommands(commands)
      
      console.log('Bot commands updated')
    } catch (error) {
      logger(error)
    }
  }
}