const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Exclui mensagens do canal')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(client, interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.reply({
                content: '❌ Você não tem permissão para excluir mensagens.',
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const messages = await interaction.channel.messages.fetch();
            let deleted = 0;

            for (const [, message] of messages) {
                if (!message.pinned && message.deletable) {
                    await message.delete().catch(() => { });
                    deleted++;
                }
            }

            await interaction.followUp({
                content: `Excluí **${deleted} ${deleted > 1 ? 'mensagens' : 'mensagem'}**.`,
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.error('[clear]', err);

            const message = process.env.NODE_ENV === 'development'
                ? `Ocorreu um erro na execução:\n\`\`\`${String(err)}\`\`\``
                : '❌ Ocorreu um erro ao excluir as mensagens.';

            await interaction.followUp({
                content: message,
                flags: MessageFlags.Ephemeral
            }).catch(() => { });
        }
    }
};