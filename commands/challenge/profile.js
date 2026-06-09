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

        await interaction.deferReply({
            content: 'Fazendo a busca...',
            flags: MessageFlags.Loading
        });

        try {
            const game = getById(gameId);
            const player = await game.members.findByName(565414, playerName ? playerName : '');

            if (!player)
                return await interaction.editReply({
                    content: '\`❌ Nenhum jogador foi encontrado no Pro Clubs!\`',
                    flags: MessageFlags.Ephemeral 
                });

            const embed = new EmbedBuilder()
                .setColor(getEmbedColor(interaction))
                .setTitle(`Estatísticas de ${player?.proName}`)
                //.setThumbnail()
                .addFields(
                    { name: 'Posição', value: String(player?.favoritePosition || player?.position), inline: true },
                    { name: 'Jogos', value: String(player?.games), inline: true },
                    { name: 'Melhor em Campo', value: String(player?.motm), inline: true },
                    { name: 'Média', value: String(player?.rating), inline: true },
                    { name: 'Gols', value: String(player?.goals), inline: true },
                    { name: 'Assistências', value: String(player?.assists), inline: true },
                    { name: 'Taxa de Vitórias', value: `${player?.winRate}%`, inline: true }
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