const { EmbedBuilder, MessageFlags } = require('discord.js');
const getEmbedColor = require('../../utils/getEmbedColor');
const { 
    exchangeNpssoForAccessCode, 
    exchangeAccessCodeForAuthTokens, 
    getProfileFromUserName
} = require('psn-api');

module.exports = {
    name: 'profile',
    data: {
        description: 'Mostra os troféus do usuário',
        options: [{
            type: 3,
            name: 'user',
            description: 'Usuário da PSN',
            required: false
        }]
    },

    async execute(client, interaction) {
        const user = interaction.options.getString('user') || 'me';

        const myNpsso = 'cjo7adTgcVazVyJVZtX3DObTlanla8xxDarHKSxiEJ9GjEAf1cmn4pvLMpODocw7';

        const accessCode = await exchangeNpssoForAccessCode(myNpsso);
        const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

        await interaction.deferReply();

        let targetAccountId = null;
        let avatarUrl = null;
        let encontrou = false;
        let offset = 0;
        const limit = 20;
        const maxPaginas = 5;

        try {
            await interaction.editReply({
                content: `Buscando o usuário **${user}**...`,
                flags: MessageFlags.Loading
            });

            const response = await getProfileFromUserName(authorization, user);

            const avatarUrl = response?.profile?.avatarUrls?.[0]?.avatarUrl;
            
            const trophySummary = response?.profile?.trophySummary;

            const platinas = trophySummary?.earnedTrophies?.platinum || 0;
            const golds = trophySummary?.earnedTrophies?.gold || 0;
            const silvers = trophySummary?.earnedTrophies?.silver || 0;
            const bronzes = trophySummary?.earnedTrophies?.bronze || 0;
            const nivelNaPsn = trophySummary?.level || 0;

            const embedColor = '#006FCD';
            
            const profileEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`${response?.profile?.plus > 0 ? '<:psplus:1511578072456106014>' : ''} ${user}`)
                .setDescription(response?.profile?.aboutMe || 'Perfil sem descrição.')
                .setThumbnail(avatarUrl)
                .addFields(
                    { name: 'Nível', value: `${nivelNaPsn}`, inline: true },
                    { name: 'Status', value: `\`${response?.profile?.presences?.[0]?.onlineStatus || 'Indefinido'}\``, inline: true },
                    { name: 'Troféus', value: ' ', inline: false },
                    { name: '<:psnplatinum:1019105745469440052> Platina', value: `**${platinas}**`, inline: true },
                    { name: '<:psngold:1019105744123072542> Ouro', value: `${golds}`, inline: true },
                    { name: '<:psnsilver:1019105748720025630> Prata', value: `${silvers}`, inline: true },
                    { name: '<:psnbronze:1019105742705410048> Bronze', value: `${bronzes}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `🎮 Perfil na PSN` })

            return await interaction.editReply({
                content: null,
                embeds: [profileEmbed],
                flags: MessageFlags.SuppressNotifications
            })
        } catch (err) {
            console.error(err);

            return await interaction.editReply({
                content: '❌ Ocorreu um erro ao mostrar o perfil da PSN.',
                flags: MessageFlags.Ephemeral 
            })
        }
    }
}