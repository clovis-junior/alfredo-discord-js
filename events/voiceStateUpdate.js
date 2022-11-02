module.exports={
    name: "voiceStateUpdate",
    once: false,

    execute(client, oldState, newState){
        if(oldState.member.user.bot) return;
    
        if(newState.channelId == "957420369646583838" || newState.channelId == "957413683502391356"){
            if(client.lobbies.has(newState.member.id)) return;
    
            let name=`Lobby de ${newState.member.displayName}`;
            if(newState.guild.id == "800948136461729802")
                name=`📞・${name}`;
            else if(newState.guild.id == "874183948601806848")
                name=`🔊┇${name}`;
    
            newState.guild.channels.create(name, {
                type: "GUILD_VOICE",
                parent: newState.channel.parentId,
                position: (newState.channel.position + 1),
                permissionOverwrites: [
                    {
                        id: newState.member.id,
                        allow: "CONNECT"
                    },
                    {
                        id: client.user.id,
                        allow: ["CONNECT", "MANAGE_CHANNELS", "MOVE_MEMBERS"]
                    },
                    {
                        id: newState.guild.roles.everyone,
                        deny: ["CREATE_INSTANT_INVITE", "CONNECT", "MANAGE_CHANNELS", "MOVE_MEMBERS"]
                    }
                ]
            })
            .then(channel=> {
                const data = {
                    guild: newState.guild,
                    channel: channel,
                    owner: newState.member,
                    lock: true
                }
                client.lobbies.set(newState.member.id, data);
                newState.member.voice.setChannel(channel.id);
            })
            .catch(console.error);
        }
    
        if(client.lobbies.has(oldState.member.id)){
            const lobby=client.lobbies.get(oldState.member.id);
    
            if (lobby.channel.members.size <= 0) {
                client.lobbies.delete(oldState.member.id);
                if(lobby.channel.deletable) lobby.channel.delete();
            }else if(lobby.channel.members.size > 0){
                const newOnwer=lobby.channel.members.first();
    
                let name=`Lobby de ${newOnwer.displayName}`;
                if(oldState.guild.id == "800948136461729802")
                    name=`📞・${name}`;
                else if(oldState.guild.id == "874183948601806848")
                    name=`🔊┇${name}`;
    
                lobby.channel.setName(name);
                lobby.channel.permissionOverwrites.edit(oldState.member.id, {
                    "CONNECT": false
                });
                lobby.channel.permissionOverwrites.create(newOnwer.id, {
                    "CONNECT": true
                });
    
                const data = {
                    guild: oldState.guild,
                    channel: lobby.channel,
                    owner: newOnwer,
                    lock: lobby.lock
                }
                client.lobbies.delete(oldState.member.id);
                client.lobbies.set(newOnwer.id, data);
            }
        }
    }
}