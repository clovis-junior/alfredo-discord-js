const fs = require('fs');
const path = require('path');
const { createSubcommandGroup } = require('./createSubcommandGroup');

function loadCommands() {
    const commands = new Map();
    const builders = [];

    const commandsPath = path.join(__dirname, '../commands');

    const folders = fs.readdirSync(commandsPath, {
        withFileTypes: true
    }).filter(entry => entry.isDirectory());

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder.name);

        const {
            builder,
            subcommands
        } = createSubcommandGroup(folderPath);

        commands.set(builder.name, {
            name: builder.name,
            data: builder,
            subcommands
        });

        builders.push(builder.toJSON())
    }

    return {
        commands,
        builders
    }
}

module.exports = loadCommands;