const {EmbedBuilder}=require("discord.js");

const model=(member, user)=>{
    return embed=new EmbedBuilder()
    .setColor(member.displayColor || "#2a5bc5")
    .setTitle(`Avatar de ${member.displayName}`)
    .setURL(user.avatarURL({size: 1024, dynamic: true}))
    .setImage(user.avatarURL({size: 512, dynamic: true}));
};

module.exports={
    name: "avatar",
    aliases: ["avt"],
    category: "utility",
    description: "Mostra o avatar da(s) pessoa(s) mencionada(s)",
    cooldown: 5,
    enabled: true,
    show: true,

    async execute(message){
        if(message.mentions.users.size){
            message.mentions.users.forEach(user=>{
                message.channel.send({embeds: [model(message.guild.members.cache.get(user.id), user)]})
            });
        }else
            message.channel.send({embeds: [model(message.guild.members.cache.get(message.author.id), message.author)]});
    }
}