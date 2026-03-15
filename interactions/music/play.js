const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');

module.exports = {
    name: 'play',
    data: {
        description: 'Toca uma música do YouTube Music.',
        options: [
            {
                name: 'nome',
                description: 'Nome ou URL da música.',
                type: 3,
                required: true
            }
        ]
    },

    async execute(client, interaction) {
        return
    }
};