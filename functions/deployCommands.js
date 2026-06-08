const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

require('dotenv').config();

function getCommandFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const commands = [];
    const ignoredFolders = ['voice'];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.js')) {
            commands.push(fullPath);
            continue;
        }

        if (entry.isDirectory()) {
            if (ignoredFolders.includes(entry.name)) continue;

            const files = fs.readdirSync(fullPath, { withFileTypes: true });

            for (const file of files) {
                const filePath = path.join(fullPath, file.name);

                if (file.isFile() && file.name.endsWith('.js')) {
                    commands.push(filePath);
                }
            }
        }
    }

    return commands;
}

async function deployCommands() {
    const commands = [];
    const interactionsPath = path.join(__dirname, '../interactions');
    const commandFiles = getCommandFiles(interactionsPath);

    console.log('Ajustando os comandos para os usuários...');

    for (const file of commandFiles) {
        delete require.cache[require.resolve(file)];
        const command = require(file);

        if (!command?.data || typeof command.data.toJSON !== 'function')
            continue;

        commands.push(command.data.toJSON());
        console.log(`-> Comandos "${command.data.name}" preparados para deploy.`);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Enviando comandos globais para a API do Discord...');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );
        console.log('Comandos registrados em todos os servidores!');
        return;
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
}

module.exports = deployCommands;