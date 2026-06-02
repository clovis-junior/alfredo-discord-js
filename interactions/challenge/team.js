const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');
const { getById, getChoices } = require('../../providers');

module.exports = {
    name: 'team',
    data: {
        description: 'Exibe perfil de um time',
        options: [{
            type: 3,
            name: 'game',
            description: 'Jogo',
            required: true,
            choices: getChoices()
        }, {
            type: 3,
            name: 'team',
            description: 'Time',
            required: true
        }]
    },

    async execute(client, interaction) {
        const gameId = interaction.options.getString('game');
        const teamName = interaction.options.getString('team');

        try {
            const game = getById(gameId);
            const club = await game.clubs.getByName(teamName);

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Estatísticas de ${club.name}`)
                .addFields(
                    { name: 'Nome do Estádio', value: String(club?.stadium), inline: false },
                    { name: 'Total de Partidas', value: String(club?.stats?.games), inline: true },
                    { name: 'Gols Feitos', value: String(club?.stats?.goals), inline: true },
                    { name: 'Gols Sofridos', value: String(club?.stats?.goalsAgainst), inline: true }
                )
                .addFields(
                    { name: 'Vitórias', value: String(club?.stats?.wins), inline: true },
                    { name: 'Derrotas', value: String(club?.stats?.losses), inline: true },
                    { name: 'Empates', value: String(club?.stats?.ties), inline: true },
                    { name: 'Taxa de Vitórias', value: `${club?.stats?.winRate}%`, inline: false }
                )
                .addFields(
                    { name: 'Partidas sem sofrer gol', value: String(club?.stats?.cleanSheets), inline: false },
                    { name: 'Artilheiro', value: `${club?.stats?.topScorer?.proName} com ${club?.stats?.topScorer?.goals} na carreira`, inline: false },
                    { name: 'Líder em Assistências', value: `${club?.stats?.topAssist?.proName} com ${club?.stats?.topAssist?.assists} na carreira`, inline: false },
                    { name: 'Melhor Média', value: `${club?.stats?.bestRating?.proName} com ${club?.stats?.bestRating?.rating} em ${club?.stats?.bestRating?.games} jogos na carreira`, inline: false }
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