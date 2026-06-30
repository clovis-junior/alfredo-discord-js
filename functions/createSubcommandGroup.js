const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');

function addOptions(command, options = []) {
  for (const option of options) {
    switch (option.type) {
      case ApplicationCommandOptionType.String:
      default:
        command.addStringOption(opt => {
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required);

          if (option.choices?.length)
            opt.addChoices(...option.choices);

          return opt
        })
        break;
      case ApplicationCommandOptionType.Integer:
        command.addIntegerOption(opt => {
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required);

          if (option.choices?.length)
            opt.addChoices(...option.choices);

          return opt
        })
        break;
      case ApplicationCommandOptionType.User:
        command.addUserOption(opt =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required)
        );
    }
  }
}

function createSubcommandGroup(folder) {
  const config = require(path.join(folder, 'index.js'));
  const subcommands = new Map();

  const builder = new SlashCommandBuilder()
    .setName(config.name)
    .setDescription(config.description);

  const files = fs.readdirSync(folder)
    .filter(file =>
      file.endsWith('.js') && !file.startsWith('index')
    );

  for (const file of files) {
    const subcommand = require(path.join(folder, file));

    subcommands.set(subcommand.name, subcommand);

    builder.addSubcommand(command => {
      command.setName(subcommand.name)
        .setDescription(subcommand.data.description);

      addOptions(command, subcommand.data.options);

      return command
    })
  }

  return { builder, subcommands }
}

module.exports = {
  createSubcommandGroup
}