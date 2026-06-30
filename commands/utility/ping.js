const { MessageFlags, EmbedBuilder } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
  name: 'ping',
  data: {
    description: 'Mostra o ping da API'
  },

  async execute(client, interaction) {
    const responseTime = Date.now() - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(getEmbedColor(interaction))
      .addFields({
        name: 'Delay de Resposta',
        value: `\`${responseTime} ms\``,
        inline: true
      }, {
        name: 'Delay da API',
        value: `\`${apiPing} ms\``,
        inline: false
      });

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.SuppressNotifications
    });
  }
}