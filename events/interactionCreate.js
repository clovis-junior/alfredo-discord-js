module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.interactions.get(interaction.commandName);
        
        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (err) {
            console.error(`[interactionCreate] Comando: ${interaction.commandName}`, err);

            const message = process.env.NODE_ENV === 'development'
            ? `Ocorreu um erro na execução:\n\`\`\`${String(err)}\`\`\``
            : '❌ Ocorreu um erro ao executar este comando.';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: message,
                    ephemeral: true
                }).catch(() => {});
                return;
            }

            await interaction.reply({
                content: message,
                ephemeral: true
            }).catch(() => {});
        }
    }
};