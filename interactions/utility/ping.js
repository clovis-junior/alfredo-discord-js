const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
    name: 'ping',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mostra o ping da API'),

    async execute(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor(getEmbedColor(interaction))
            .setTimestamp()
            .addFields(
                { inline: true, name: 'Delay de Reposta', value: `${Math.round(Math.floor((Date.now() - interaction?.createdTimestamp)) / 1000)} ms` },
                { inline: true, name: 'Delay da API', value: `${Math.round(interaction?.client?.ws?.ping)} ms` }
            );

        await interaction.reply({ embeds: [embed] })
    }
}