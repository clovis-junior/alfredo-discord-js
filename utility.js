const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { createSubcommandGroup } = require('../functions/createSubcommandGroup');

const name = 'utility';

const {
  builder,
  subcommands
} = createSubcommandGroup(
  name,
  'Comandos úteis',
  path.join(__dirname, name)
);

module.exports = {
  name: name,
  data: builder,

  async execute(client, interaction) {
    const subcommandName = interaction.options.getSubcommand();
    const subcommand = subcommands.get(subcommandName);

    if (!subcommand)
      return;

    await subcommand.execute(client, interaction)
  }
};