module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.interactions.get(interaction.commandName);
        
        if (!command) return;

        const subcommandName =
            interaction.options.getSubcommand();

        const subcommand =
            command.subcommands.get(subcommandName);

        if (!subcommand)
            return;

        try {
            await subcommand.execute(client, interaction);
        } catch (err) {
            console.error(`[interactionCreate] Comando: ${interaction.commandName}`, err);

            const message = process.env.NODE_ENV === 'development'
            ? `Ocorreu um erro na execução:\n\`\`\`${String(err)}\`\`\``
            : '❌ Ocorreu um erro ao executar este comando.';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: message,
                    ephemeral: true
                });
                
                return
            }

            await interaction.reply({
                content: message,
                ephemeral: true
            })
        }
    }
};