<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");

const model=(member)=>{
    return embed=new MessageEmbed()
=======
const {EmbedBuilder}=require("discord.js");

const model=(member)=>{
    return embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
    .setColor("#107C10")
    .setTitle(`Gamertag de ${member.displayName}`)
    .addField("Gamerscore", "0G");
};

module.exports={
    name: "gamertag",
    aliases: ["xbox", "gt"],
    category: "gaming",
    description: "Mostra a gamertag do usuário.",
    cooldown: 10,
    enabled: true,
    show: false,

    async execute(message){
        message.channel.send({embeds: [model(message.guild.members.cache.get(message.author.id))]});
    }
}