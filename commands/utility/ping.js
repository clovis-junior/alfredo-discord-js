const {MessageEmbed}=require("discord.js");

module.exports={
    name: "ping",
    aliases: ["delay"],
    category: "utility",
    description: "",
    cooldown: 5,
    enabled: true,
    show: true,

    async execute(message, client){
        const embed=new MessageEmbed()
        .setColor("#2a5bc5")
        .addField("Delay de Reposta", `${Math.round(Math.floor((Date.now() - message.createdTimestamp)) / 1000)} ms`, true)
        .addField("Delay da API", `${Math.round(client.ws.ping)} ms`, true)
        .setTimestamp();
        
        message.channel.send({embeds: [embed]})
    }
}