const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const subcommands = new Map();

const subcommandsPath = path.join(__dirname, 'music');
const files = fs.readdirSync(subcommandsPath).filter(file => file.endsWith('.js'));

const builder = new SlashCommandBuilder()
    .setName('music')
    .setDescription('Gerencia o que o Alfredo está tocando.');

for (const file of files) {

    const subcommand = require(path.join(subcommandsPath, file));

    subcommands.set(subcommand.name, subcommand);

    builder.addSubcommand(command => {

        command.setName(subcommand.name)
            .setDescription(subcommand.data.description);

        if (subcommand.data.options) {
            for (const option of subcommand.data.options) {
                if (option.type === 3) {
                    command.addStringOption(opt =>
                        opt.setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required)
                    );
                }
            }
        }

        return command;
    });
}

module.exports = {
    name: 'music',
    data: builder,

    async execute(client, interaction) {

        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommands.get(subcommandName);

        if (!subcommand) {
            return interaction.reply({
                content: '❌ Subcomando inválido.',
                flags: MessageFlags.Ephemeral
            });
        }

        await subcommand.execute(client, interaction);
    }
};