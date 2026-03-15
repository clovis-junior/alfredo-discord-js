const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
    name: 'limit',
    data: {
        description: 'Define o limite de usuários do voice',
        options: [
            {
                name: 'quantidade',
                description: 'Número máximo de pessoas (0 = ilimitado)',
                type: 4,
                required: true
            }
        ]
    },

    async execute(client, interaction) {

        if (!client.voices.has(interaction.user.id)) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> você não tem um voice criado.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const voice = client.voices.get(interaction.user.id);
        const limit = interaction.options.getInteger('quantidade');

        if (limit < 0 || limit > 99) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> o valor **precisa** ser de **0 a 99**.`,
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const channel = await client.channels.fetch(voice.channelId);

            await channel.setUserLimit(limit);

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Agora seu voice comporta ${limit ? limit : 'número ilimitado de'} pessoa(s).`);

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });

        } catch (err) {

            console.error('[voice limit]', err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao alterar o limite do voice.',
                flags: MessageFlags.Ephemeral
            }).catch(() => { });

        }
    }
};