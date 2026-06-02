const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

const model = (interaction, member) => {
    return new EmbedBuilder()
        .setColor(getEmbedColor(interaction))
        .setTitle(`Avatar de ${member.displayName}`)
        .setURL(
            member.user.avatarURL({ size: 1024 })
        )
        .setImage(
            member.user.avatarURL({ size: 1024 })
        );
};

module.exports = {
    name: 'avatar',
    data: {
        description: 'Mostra o avatar de um usuário',
        options: [{
            type: 6,
            name: 'user',
            description: 'Usuário para mostrar o avatar',
            required: false
        }]
    },

    async execute(client, interaction) {
        const member = interaction.options.getMember('usuario') ||
            interaction.member;

        return interaction.reply({
            embeds: [model(interaction, member)],
            flags: MessageFlags.SuppressNotifications
        })
    }
}