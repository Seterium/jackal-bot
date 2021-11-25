#!/usr/bin/env node
import dotenv from 'dotenv'
import { Command } from 'commander';
import controllers from '#@/cli/_index.js'

dotenv.config()

const cli = new Command()

cli
  .command('test')
  .description('Test command')
  .action(controllers.test)

cli
  .command('yt-id')
  .argument('<url>', 'Channel URL')
  .description('Get Youtube channel ID by URL')
  .action(controllers.getChannelId)

cli
  .command('set-bot-commands')
  .description('Update bot commands list from utils/contants file')
  .action(controllers.setBotCommands)

console.log('\r\nJackal bot CLI\r\n')

cli.parse(process.argv)