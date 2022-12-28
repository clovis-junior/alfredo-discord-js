<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

module.exports={
    name: "ping",
    aliases: ["delay"],
    category: "utility",
    description: "",
    cooldown: 5,
    enabled: true,
    show: true,

    async execute(message, client){
<<<<<<< HEAD
        const embed=new MessageEmbed()
=======
        const embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
        .setColor("#2a5bc5")
        .addField("Delay de Reposta", `${Math.round(Math.floor((Date.now() - message.createdTimestamp)) / 1000)} ms`, true)
        .addField("Delay da API", `${Math.round(client.ws.ping)} ms`, true)
        .setTimestamp();
        
        message.channel.send({embeds: [embed]})
    }
}