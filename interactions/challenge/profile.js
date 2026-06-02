const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');
const { getById, getChoices } = require('../../providers');


module.exports = {
    name: 'profile',
    data: {
        description: 'Exibe perfil de um jogador',
        options: [{
            type: 3,
            name: 'game',
            description: 'Jogo',
            required: true,
            choices: getChoices()
        }, {
            type: 3,
            name: 'player',
            description: 'Jogador',
            required: false
        }]
    },

    async execute(client, interaction) {
        const gameId = interaction.options.getString('game');
        const playerName = interaction.options.getString('player');

        try {
            const game = getById(gameId);
            const player = await game.members.getMemberCareer(565414, playerName ? playerName : 'Mexilhao');

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Estatísticas de ${player?.proName}`)
                .addFields(
                    { name: 'Jogos', value: String(player?.games), inline: true },
                    { name: 'Melhor em Campo', value: String(player?.motm), inline: true },
                    { name: 'Média', value: String(player?.rating), inline: true },
                    { name: 'Gols', value: String(player?.goals), inline: true },
                    { name: 'Assistências', value: String(player?.assists), inline: true },
                    { name: 'Taxa de Vitórias', value: `${player?.wins}%`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `${game.icon} ${game.name}` })

            return await interaction.reply({
                embeds: [embed]
            })
        } catch (err) {
            console.error(err);

            return await interaction.reply({
                content: '❌ Ocorreu um erro ao mostrar o perfil.',
                flags: MessageFlags.Ephemeral
            })
        }
    }
};