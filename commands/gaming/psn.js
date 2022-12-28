<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

const model=(member, client)=>{
    let trophy_bronze=client.emojis.cache.find(emoji => emoji.name === "psnbronze") || "",
        trophy_silver=client.emojis.cache.find(emoji => emoji.name === "psnsilver") || "",
        trophy_gold=client.emojis.cache.find(emoji => emoji.name === "psngold") || "",
        trophy_platinum=client.emojis.cache.find(emoji => emoji.name === "psnplatinum") || "";

<<<<<<< HEAD
    return embed=new MessageEmbed()
=======
    return embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
    .setColor("#003087")
    .setTitle(`PSN ID de ${member.displayName}`)
    .addField("Troféus", `${trophy_platinum} *0*・${trophy_gold} *0*・${trophy_silver} *0*・${trophy_bronze} *0*`);
};

module.exports={
    name: "psn",
    aliases: ["playstation", "psnid", "ps"],
    category: "gaming",
    description: "Mostra a PSN ID do usuário.",
    cooldown: 10,
    enabled: true,
    show: false,

    async execute(message, client){
        message.channel.send({embeds: [model(message.guild.members.cache.get(message.author.id), client)]});
    }
}