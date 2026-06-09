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

        await interaction.deferReply({
            content: 'Fazendo a busca...',
            flags: MessageFlags.Loading
        });

        try {
            const game = getById(gameId);
            const club = await game.clubs.getByName(teamName);

            if (!club)
                return await interaction.editReply({
                    content: '\`❌ Nenhum time foi encontrado no Pro Clubs!\`',
                    flags: MessageFlags.Ephemeral 
                });

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Estatísticas de ${club?.name}`)
                .setThumbnail(club?.emblem)
                .addFields(
                    { name: 'Nome do Estádio', value: String(club?.stadium), inline: true },
                    { name: 'Total de Partidas', value: String(club?.stats?.games), inline: true }
                )
                .addFields(
                    { name: 'Gols Feitos', value: String(club?.stats?.goals), inline: true },
                    { name: 'Gols Sofridos', value: String(club?.stats?.goalsAgainst), inline: true },
                    { name: 'Média de Gols', value: String(club?.stats?.goalsAverage.toFixed(1)), inline: true },
                    { name: 'Saldo de Gols', value: String(club?.stats?.goalsDifference), inline: true }
                )
                .addFields(
                    { name: 'Vitórias', value: String(club?.stats?.wins), inline: true },
                    { name: 'Derrotas', value: String(club?.stats?.losses), inline: true },
                    { name: 'Empates', value: String(club?.stats?.ties), inline: true },
                    { name: 'Taxa de Vitórias', value: `*${club?.stats?.winRate.toFixed(1)}%*`, inline: false }
                )
                .addFields(
                    { name: 'Partidas sem sofrer gol', value: String(club?.stats?.cleanSheets), inline: false },
                    { name: 'Artilheiro', value: `**${club?.stats?.topScorer?.proName}** - \`${club?.stats?.topScorer?.goals} gols na carreira\``, inline: false },
                    { name: 'Líder em Assistências', value: `**${club?.stats?.topAssist?.proName}** - \`${club?.stats?.topAssist?.assists} assistências na carreira\``, inline: false },
                    { name: 'Melhor Média', value: `**${club?.stats?.bestRating?.proName}** - \`${club?.stats?.bestRating?.rating} em ${club?.stats?.bestRating?.games} jogos na carreira\``, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${game.icon} ${game.name}` })

            return await interaction.editReply({
                embeds: [embed],
                flags: MessageFlags.SuppressNotifications
            })
        } catch (err) {
            console.error(err);

            return await interaction.editReply({
                content: '❌ Ocorreu um erro ao mostrar o perfil.',
                flags: MessageFlags.Ephemeral
            })
        }
    }
};