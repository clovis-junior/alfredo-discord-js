const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');

const subcommands = new Map();

const subcommandsPath = path.join(__dirname, 'challenge');
const files = fs.readdirSync(subcommandsPath).filter(file => file.endsWith('.js'));

const builder = new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Sistema competitivo');

for (const file of files) {
    const subcommand = require(path.join(subcommandsPath, file));

    subcommands.set(subcommand.name, subcommand);

    builder.addSubcommand(command => {
        command.setName(subcommand.name)
            .setDescription(subcommand.data.description);

        if (subcommand.data.options) {
            for (const option of subcommand.data.options) {
                switch (option.type) {
                    case 3:
                        command.addStringOption(opt => {
                            opt.setName(option.name)
                                .setDescription(option.description)
                                .setRequired(option.required);

                            if (option.choices?.length)
                                opt.addChoices(...option.choices);

                            return opt
                        });
                        break;
                    case 4:
                        command.addIntegerOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description)
                                .setRequired(option.required)
                        );
                        break;
                    case 6:
                        command.addUserOption(opt =>
                            opt.setName(option.name)
                                .setDescription(option.description)
                                .setRequired(option.required)
                        );
                        break;
                    default:
                        console.warn(`Tipo de opção não suportado: ${option.type}`);
                }
            }
        }

        return command
    })
}

module.exports = {
    name: 'challenge',
    data: builder,

    async execute(client, interaction) {
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommands.get(subcommandName);

        if (!subcommand) {
            return interaction.reply({
                content: '❌ Subcomando inválido.',
                flags: MessageFlags.Ephemeral
            })
        }

        await subcommand.execute(client, interaction)
    }
}