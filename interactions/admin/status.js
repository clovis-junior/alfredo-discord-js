const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');

const status = [
   { name: 'Online', value: 'online'}, 
   { name: 'Ausente', value: 'idle'},
   { name: 'Não Perturbe', value: 'dnd'},
   { name: 'Invisivel', value: 'invisible'}
];

const activities = [
   { name: 'Jogando', value: 'PLAYING'},
   { name: 'Transmitindo', value: 'STREAMING'},
   { name: 'Ouvindo', value: 'LISTENING'},
   { name: 'Assistindo', value: 'WATCHING'}
];

module.exports = {
    name: 'status',
    data: {
        description: 'Define o status do Alfredo',
        options: [{
            type: 3,
            name: 'status',
            description: 'Status',
            required: true,
            choices: status
        },{
            type: 3,
            name: 'activity',
            description: 'Atividade',
            required: true,
            choices: activities
        },{
            type: 6,
            name: 'description',
            description: 'Detalhe',
            required: true
        }]
    },

    async execute(client, interaction) {
        const status = interaction.options.getString('status');
        const activity = interaction.options.getString('player');
        const description = interaction.options.getString('description');

        await interaction.deferReply();

        try {
            client.user.setActivity(description, { type: activity });
            client.user.setStatus(status); 

            await interaction.editReply({
                content: 'Meu status foi alterado!',
                flags: MessageFlags.Ephemeral
            })
        } catch (err) {
            console.error(err);

            await interaction.editReply({
                content: '❌ Ocorreu um erro ao excluir as mensagens.',
                flags: MessageFlags.Ephemeral
            })
        }
    }
};