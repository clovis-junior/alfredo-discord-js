const {EmbedBuilder}=require("discord.js");

const model=(member, channel)=>{
    return embed=new EmbedBuilder()
    .setColor(member.displayColor || "#2a5bc5")
    .setTitle(`${user.displayName} foi convidado para ${channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")}`);
};

module.exports={
    name: "invite",
    aliases: ["call"],
    category: "voice",
    description: "",
    cooldown: 2,
    enabled: true,
    show: true,

    async execute(message, client){
        if(client.lobbies.has(message.author.id)){
            const lobby=client.lobbies.get(message.author.id);
            
            if(message.mentions.users.size){
                message.mentions.users.forEach(user=>{
                    lobby.channel.permissionOverwrites.create(user.id, {
                        "CONNECT": true
                    });
                    message.channel.send({embeds: [model(message.guild.members.cache.get(user.id), lobby.channel)]})
                });
            }
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}