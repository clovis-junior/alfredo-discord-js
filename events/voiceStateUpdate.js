const {
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');

const JOIN_TO_CREATE_CHANNEL_IDS = [
    '957420369646583838',
    '957413683502391356'
];

function isJoinToCreateChannel(channelId) {
    return JOIN_TO_CREATE_CHANNEL_IDS.includes(channelId);
}

function buildLobbyName(member, guildId) {
    let name = `Lobby de ${member.displayName}`;

    if (guildId === '800948136461729802') {
        return `📞・${name}`;
    }

    if (guildId === '874183948601806848') {
        return `🔊┇${name}`;
    }

    return `⏳・${name}`;
}

async function createLobby(client, member, sourceChannel) {
    const guild = member.guild;

    const channel = await guild.channels.create({
        name: buildLobbyName(member, guild.id),
        type: ChannelType.GuildVoice,
        parent: sourceChannel.parentId,
        position: sourceChannel.position + 1,
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.CreateInstantInvite,
                    PermissionFlagsBits.ManageChannels,
                    PermissionFlagsBits.MoveMembers
                ]
            },
            {
                id: member.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak
                ]
            },
            {
                id: client.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.ManageChannels,
                    PermissionFlagsBits.MoveMembers
                ]
            }
        ]
    });

    const data = {
        guildId: guild.id,
        channelId: channel.id,
        ownerId: member.id,
        lock: true
    };

    client.voices?.set(member.id, data);

    await member.voice.setChannel(channel.id).catch(() => null);

    return channel;
}

async function transferLobbyOwnership(client, lobby, oldOwnerMember, newOwnerMember) {
    const channel = oldOwnerMember.guild.channels.cache.get(lobby.channelId);
    if (!channel) {
        client.voices?.delete(oldOwnerMember.id);
        return;
    }

    await channel.setName(buildLobbyName(newOwnerMember, oldOwnerMember.guild.id)).catch(() => null);

    await channel.permissionOverwrites.edit(oldOwnerMember.id, {
        ViewChannel: true,
        Connect: false,
        Speak: false
    }).catch(() => null);

    await channel.permissionOverwrites.edit(newOwnerMember.id, {
        ViewChannel: true,
        Connect: true,
        Speak: true
    }).catch(() => null);

    client.voices?.delete(oldOwnerMember.id);
    client.voices?.set(newOwnerMember.id, {
        guildId: oldOwnerMember.guild.id,
        channelId: channel.id,
        ownerId: newOwnerMember.id,
        lock: lobby.lock
    });
}

module.exports = {
    name: 'voiceStateUpdate',
    once: false,

    async execute(client, oldState, newState) {
        try {
            const member = newState.member || oldState.member;
            if (!member || member.user.bot) return;

            const oldChannelId = oldState.channelId;
            const newChannelId = newState.channelId;

            // ignora updates que não mudaram de canal
            if (oldChannelId === newChannelId) return;

            // Entrou em um canal "join to create"
            if (newChannelId && isJoinToCreateChannel(newChannelId)) {
                if (!client.voices?.has(member.id)) {
                    await createLobby(client, member, newState.channel);
                }
            }

            // Se o usuário era owner de um lobby e saiu dele
            if (client.voices?.has(member.id)) {
                const lobby = client.voices?.get(member.id);
                const oldChannel = oldState.guild.channels.cache.get(lobby.channelId);

                if (!oldChannel) {
                    client.voices?.delete(member.id);
                    return;
                }

                const stillInLobby = newChannelId === lobby.channelId;
                if (stillInLobby) return;

                if (oldChannel.members.size <= 0) {
                    client.voices?.delete(member.id);

                    if (oldChannel.deletable) {
                        await oldChannel.delete().catch(() => null);
                    }

                    return;
                }

                const newOwner = oldChannel.members.first();
                if (!newOwner) return;

                await transferLobbyOwnership(client, lobby, member, newOwner);
            }
        } catch (error) {
            console.error('Erro no voiceStateUpdate:', error);
        }
    }
}