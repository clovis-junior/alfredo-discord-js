const deployCommands = require('../functions/deployCommands');

module.exports = {
    name: 'clientReady',
    once: true,

    async execute(client) {
        const guildCount = client.guilds.cache.size;

        console.log(
            `Logado como ${client.user.tag}\n` +
            `-> Pronto para uso em ${guildCount} ${guildCount > 1 ? 'servidores' : 'servidor'}.`
        );

        // Exemplo de presença
        // client.user.setActivity('gerenciando lobbies', { type: 0 });

        await deployCommands();

        console.timeEnd('-> Tempo de inicialização')
    }
}