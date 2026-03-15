const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

function buildLobbyName(name, guildId) {
    if (guildId === '800948136461729802') {
        return `📞・${name}`;
    }

    if (guildId === '874183948601806848') {
        return `🔊┇${name}`;
    }

    return `⏳・${name}`;
}

module.exports = {
    name: 'rename',
    data: {
        description: 'Renomeia o seu lobby',
        options: [
            {
                name: 'nome',
                description: 'Novo nome do lobby',
                type: 3,
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
        const newNameRaw = interaction.options.getString('nome');

        const newName = newNameRaw
            ?.replace(/\s+/g, ' ')
            ?.trim()
            ?.slice(0, 100);

        if (!newName || newName.length < 2) {
            return await interaction.reply({
                content: '❌ O nome do lobby precisa ter pelo menos 2 caracteres.',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const channel = await client.channels.fetch(voice.channelId);

            await channel.setName(buildLobbyName(newName, voice.guildId));

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Seu lobby agora se chama **${newName}**.`);

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error('[lobby rename]', err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao renomear o lobby.',
                flags: MessageFlags.Ephemeral
            }).catch(() => {});
        }
    }
};