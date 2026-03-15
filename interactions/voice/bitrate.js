const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
    name: 'bitrate',
    data: {
        description: 'Altera a taxa de bits do voice',
        options: [
            {
                name: 'valor',
                description: 'Taxa de bits em kbps',
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
        const bitrateValue = interaction.options.getInteger('valor');
        const maxBitrate = Math.floor(interaction.guild.maximumBitrate / 1000);

        console.log(bitrateValue);

        if (bitrateValue < 8 || bitrateValue > maxBitrate) {
            return await interaction.reply({
                content: `<@${interaction.user.id}> a taxa de bits do canal precisa ser entre **8** e **${maxBitrate}**.`,
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const channel = await client.channels.fetch(voice.channelId);

            await channel.setBitrate(bitrateValue * 1000);

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Agora seu voice tem a taxa de bits de ${bitrateValue} kbps.`);

            return await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error('[voice bitrate]', err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao alterar a taxa de bits do voice.',
                flags: MessageFlags.Ephemeral
            }).catch(() => { });
        }
    }
};