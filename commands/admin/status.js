const { SlashCommandBuilder, ActivityType, MessageFlags, PermissionsBitField } = require('discord.js');

const statusOptions = [
   { name: 'Online', value: 'online' }, 
   { name: 'Ausente', value: 'idle' },
   { name: 'Não Perturbe', value: 'dnd' },
   { name: 'Invisivel', value: 'invisible' }
];

const activitiesOptions = [
   { name: 'Jogando', value: ActivityType.Playing },
   { name: 'Transmitindo', value: ActivityType.Streaming },
   { name: 'Ouvindo', value: ActivityType.Listening },
   { name: 'Assistindo', value: ActivityType.Watching }
];

function urlCheck(value) {
  let filter = /^(https?)\:\/\/(?:www\.)?([a-zA-Z0-9-:]{1,256})\.([a-zA-Z0-9.]{2,})\b([a-zA-Z0-9-_()@:%\+.~#?&\/\/=]*)$/is;
  return (filter.test(value)) ? true : false;
}

module.exports = {
    name: 'status',
    data: {
        description: 'Define o status do Alfredo',
        permissions: [PermissionsBitField.Flags.Administrator],
        options: [{
            type: 3,
            name: 'status',
            description: 'Status',
            required: true,
            choices: statusOptions
        },{
            type: 4,
            name: 'atividade',
            description: 'Atividade',
            required: false,
            choices: activitiesOptions
        },{
            type: 3,
            name: 'detalhe',
            description: 'Detalhe',
            required: false
        }]
    },

    async execute(client, interaction) {
        const status = interaction.options.getString('status');
        const activity = interaction.options.getInteger('atividade', false);
        const description = interaction.options.getString('detalhe');

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const presence = { status: status };

            if (description) {
                const activitiesObj = {
                    name: description,
                    type: activity ?? ActivityType.Playing
                };
                
                if (activity === ActivityType.Streaming)
                    activitiesObj.url = urlCheck(description) || 'https://twitch.tv';

                presence.activities = [activitiesObj]
            }

            client.user.setPresence(presence);

            await interaction.editReply({
                content: '✅ Meu status foi alterado!',
            })
        } catch (err) {
            console.error(err);

            await interaction.editReply({
                content: '❌ Ocorreu um erro ao alterar o status.'
            })
        }
    }
};