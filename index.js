require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

console.time('-> Tempo de inicialização');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

client.interactions = new Collection();
client.voices = new Collection();
client.cooldowns = new Collection();

/* Import Events ------------------------------------------ */

console.log('Carregando eventos...');

const eventsPath = path.join(__dirname, 'events');
const events = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of events) {
    const event = require(path.join(eventsPath, file));

    if (!event.name || typeof event.execute !== 'function') {
        console.warn(`-> Evento inválido ignorado: ${file}`);
        continue;
    }

    if (event.once)
        client.once(event.name, (...args) => event.execute(client, ...args));
    else
        client.on(event.name, (...args) => event.execute(client, ...args));

    console.log(`-> Evento "${event.name}" carregado com sucesso!`);
}

/* Import Interactions ------------------------------------------ */

console.log('Carregando comandos..');

const interactionsPath = path.join(__dirname, 'interactions');
const interactionEntries = fs.readdirSync(interactionsPath, { withFileTypes: true });

for (const entry of interactionEntries) {
    const entryPath = path.join(interactionsPath, entry.name);

    // Se for arquivo .js direto em /interactions
    if (entry.isFile() && entry.name.endsWith('.js')) {
        const interaction = require(entryPath);

        if (!interaction.name || typeof interaction.execute !== 'function') {
            console.warn(`-> Comando inválido ignorado: ${entry.name}`);
            continue;
        }

        client.interactions.set(interaction.name, interaction);
        console.log(`-> Comando "${interaction.name}" carregado com sucesso!`);
        continue;
    }

    // Se for pasta
    if (entry.isDirectory()) {
        const files = fs
            .readdirSync(entryPath)
            .filter(file => file.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(entryPath, file);
            const interaction = require(filePath);

            if (!interaction.name || typeof interaction.execute !== 'function') {
                console.warn(`-> Comando inválido ignorado: ${entry.name}/${file}`);
                continue;
            }

            client.interactions.set(interaction.name, interaction);
            console.log(`-> Comando "${interaction.name}" carregado com sucesso!`);
        }
    }
}

/* Start ------------------------------------------ */

client.login(process.env.DISCORD_TOKEN);