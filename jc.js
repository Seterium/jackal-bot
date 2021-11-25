#!/usr/bin/env node
import dotenv from 'dotenv'
import { Command } from 'commander';
import controllers from '#@/src/cli/_index.js'

dotenv.config()

const cli = new Command()

cli
  .command('test')
  .description('Test command')
  .action(controllers.test)


cli.parse(process.argv)