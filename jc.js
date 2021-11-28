#!/usr/bin/env node

import dotenv from 'dotenv'
import { Command } from 'commander';
import controllers from '#@/cli/_index.js'

dotenv.config()

const cli = new Command()

cli
  .command('test')
  .description('Test command')
  .action(controllers.runTestCommand)

cli
  .command('yt-id')
  .argument('<url>', 'Channel URL')
  .description('Get Youtube channel ID by URL')
  .action(controllers.getChannelId)

cli
  .command('set-bot-commands')
  .description('Update bot commands list from utils/contants file')
  .action(controllers.setBotCommands)

// cli
//   .command('yt-download')
//   .argument('<url>', 'Video URL')
//   .description('Get Youtube "jackal" video by URL')
//   .action(controllers.downloadVideo)

console.log()

cli.parse(process.argv)