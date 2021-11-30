import { Command } from 'commander';
import importDirectory from 'esm-import-directory'

export default {
  async init() {
    const commands = await importDirectory(`${process.env.PWD}/src/Cli`)

    const cli = new Command()

    commands.forEach(config => {
      const { 
        command, 
        handler, 
        description = '', 
        arguments: args = [],
        options = []
      } = config

      const instance = cli.command(command)

      instance.action(handler)

      if (description) {
        instance.description(description)
      }

      if (args.length) {
        args.forEach(arg => {
          const {
            name,
            description = `"${name}" command description`, 
            required = false, 
            default: def = undefined 
          } = arg

          const formattedName = required ? `<${arg}>` : `[${arg}]`

          instance.argument(formattedName, description, def)
        })
      }

      if (options.length) {
        options.forEach(option => {
          const {
            name,
            description = `"${name}" option description`,
            default: def = undefined
          } = option

          instance.option(name, description, def)
        })
      }
    })

    console.log()

    cli.parse(process.argv)
  }
}