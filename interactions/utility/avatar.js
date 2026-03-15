const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

const model = (interaction) => {
    return new EmbedBuilder()
        .setColor(getEmbedColor(interaction))
        .setTitle(`Avatar de ${interaction?.member.displayName}`)
        .setURL(interaction?.user.avatarURL({ size: 1024, dynamic: true }))
        .setImage(interaction?.user.avatarURL({ size: 512, dynamic: true }))
};

module.exports = {
    name: 'avatar',
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Mostra o avatar de um usuário')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuário para mostrar o avatar')
                .setRequired(false)
        ),

    async execute(client, interaction) {
        if (interaction?.options.data.map(user => user).length > 0) {
            await interaction?.deferReply();

            return await interaction?.options.data.map(({ user }) => user).forEach(user => {
                interaction?.followUp({ embeds: [model(interaction?.guild?.members?.cache?.get(user.id), user)] })
            });
        }

        return await interaction?.reply({ embeds: [model(interaction)] });
    }
}