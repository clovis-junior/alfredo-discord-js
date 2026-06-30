require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const loadCommands = require('./functions/commandLoader');

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

const {
  commands,
  builders
} = loadCommands();

client.interactions = commands;

/* Start ------------------------------------------ */

client.login(process.env.DISCORD_TOKEN);