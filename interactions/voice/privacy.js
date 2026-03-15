const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'privacy',
    data: {
        description: 'Abre ou fecha o voice para o público'
    },

    async execute(client, interaction) {
        if (!client.voices.has(interaction.user.id)) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> você não tem um voice criado.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const voice = client.voices.get(interaction.user.id);
        const embed = new EmbedBuilder();

        try {
            const isOpening = voice.lock;

            const channel = await client.channels.fetch(voice.channelId);

            await channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                {
                    Connect: isOpening
                }
            );

            voice.lock = !voice.lock;

            if (isOpening) {
                embed
                    .setColor('#4fa03f')
                    .setTitle(`${channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')} está aberto para o público.`);
            } else {
                embed
                    .setColor('#d83749')
                    .setTitle(`${channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')} está fechado para o público.`);
            }

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error('[voice privacy]', err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao alterar a privacidade do voice.',
                flags: MessageFlags.Ephemeral
            }).catch(() => {});
        }
    }
};