<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

module.exports={
    name: "ping",
    enabled: true,

    async execute(interaction){
<<<<<<< HEAD
        const embed=new MessageEmbed()
=======
        const embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
        .setColor("#2a5bc5")
        .addField("Delay de Reposta", `${Math.round(Math.floor((Date.now() - interaction.createdTimestamp)) / 1000)} ms`, true)
        .addField("Delay da API", `${Math.round(interaction.client.ws.ping)} ms`, true)
        .setTimestamp();
        
        await interaction.reply({embeds: [embed]})
    }
}