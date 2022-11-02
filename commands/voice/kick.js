const {MessageEmbed}=require("discord.js");

const model=(member, channel)=>{
    return embed=new MessageEmbed()
    .setColor(member.displayColor || "#2a5bc5")
    .setTitle(`${user.displayName} foi convidado para ${channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")}`);
};

module.exports={
    name: "kick",
    aliases: [],
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
                    const member=message.guild.members.cache.get(user.id);

                    if(user.id == lobby.onwer.id)
                        return message.channel.send(`<@${message.author.id}> não dá para kickar você mesmo :thinking:`)

                    if(lobby.channel.members.has(user.id))
                        member.voice.disconnect();
                    else
                        return message.channel.send(`<@${message.author.id}> o usuário **${member.displayName}** não está em seu lobby.`)
                });
            }
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}