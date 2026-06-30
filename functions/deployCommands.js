require('dotenv').config();

const { REST, Routes } = require('discord.js');

const loadCommands = require('./commandLoader');

async function deployCommands() {
  const { builders } = loadCommands();

  const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_TOKEN);

  console.log('Preparando os comandos para os usuários...');

  try {
    for (const builder of builders) {
      console.debug(`-> Comandos "${builder.name}" preparados para deploy.`)
    }

    console.log('Enviando comandos globais para a API do Discord...');

    if (process.env.NODE_ENV === 'development') {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        { body: builders }
      )
    } else {
      await rest.put(
        Routes.applicationCommands(
          process.env.DISCORD_CLIENT_ID
        ),
        { body: builders }
      )
    }

    console.log('Comandos registrados!');
  } catch (err) {
    console.error('Erro ao registrar comandos:', err)
  }
}

module.exports = deployCommands;