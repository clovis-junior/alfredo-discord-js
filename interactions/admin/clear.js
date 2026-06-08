const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    data: {
        description: 'Exclui mensagens do canal',
        permissions: [PermissionsBitField.Flags.ManageMessages],
        options: [{
            type: 4,
            name: 'size',
            description: 'Quantidade de mensagens',
            required: true,
            minValue: 1,
            maxValue: 100
        }]
    },

    async execute(client, interaction) {
        const amount = interaction.options.getInteger('size');

        await interaction.deferReply();

        try {
            await interaction.editReply({
                content: 'Fazendo a faxina...',
                flags: MessageFlags.Ephemeral
            });

            const deleted = await interaction.channel.bulkDelete(amount, true);

            await interaction.editReply({
                content: `🗑️ Excluí **${deleted.size} mensagens**.`
            })
        } catch (err) {
            console.error(err);

            await interaction.editReply({
                content: '❌ Ocorreu um erro ao excluir as mensagens.'
            })
        }
    }
};