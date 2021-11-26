import { Telegram } from 'telegraf'
import logger from '#@/utils/helpers/logger.js'

import { commands } from '#@/utils/constants.js'

export default async () => {
  const bot = new Telegram(process.env.BOT_TOKEN)

  try {
    await bot.setMyCommands(commands)
    
    console.log('Bot commands updated')
  } catch (error) {
    logger(error)
  }
}