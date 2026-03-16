const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
    name: 'kick',
    data: {
        description: 'Expulsa um usuário do seu lobby',
        options: [
            {
                name: 'pessoa',
                description: 'Usuário para expulsar do lobby',
                type: 6,
                required: true
            }
        ]
    },

    async execute(client, interaction) {
        if (!client.voices.has(interaction.user.id)) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> você não tem um lobby criado.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const voice = client.voices.get(interaction.user.id);
        const user = interaction.options.getUser('pessoa');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: '❌ Não consegui localizar esse usuário no servidor.',
                flags: MessageFlags.Ephemeral
            });
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply({
                content: '🤔 Você não pode expulsar você mesmo do seu lobby.',
                flags: MessageFlags.Ephemeral
            });
        }

        if (!voice.channel?.members?.has(user.id)) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> o usuário **${member.displayName}** não está em seu lobby.`,
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await member.voice.disconnect();

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`${member.displayName} foi expulso de ${voice.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}.`);

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error('[lobby kick]', err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao expulsar esse usuário do lobby.',
                flags: MessageFlags.Ephemeral
            }).catch(() => {});
        }
    }
};