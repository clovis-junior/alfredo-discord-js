const getEmbedColor = require('../../utils/getEmbedColor');
const { EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

const model = (member) => {
    return new EmbedBuilder()
        .setColor(getEmbedColor(interaction))
        .setTitle(`Você convidou ${member.displayName} para seu voice.`);
};

module.exports = {
    name: 'invite',
    data: {
        description: 'Convida um usuário para o voice',
        options: [
            {
                name: 'pessoa',
                description: 'Usuário para convidar',
                type: 6,
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
        const user = interaction.options.getUser('pessoa');
        const member = interaction.guild.members.cache.get(user.id);

        try {
            const channel = await client.channels.fetch(voice.channelId);

            await channel.permissionOverwrites.edit(user.id, {
                Connect: true
            });

            await interaction.reply({
                embeds: [model(member)],
                flags: MessageFlags.Ephemeral
            });

        } catch (err) {

            console.error('[voice invite]', err);

            await interaction.reply({
                content: '❌ Não consegui convidar este usuário.',
                flags: MessageFlags.Ephemeral
            }).catch(() => { });

        }
    }
};