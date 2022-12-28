const {EmbedBuilder}=require("discord.js");

module.exports={
    name: "ping",
    enabled: true,

    async execute(interaction){
        const embed=new EmbedBuilder()
        .setColor("#2a5bc5")
        .addField("Delay de Reposta", `${Math.round(Math.floor((Date.now() - interaction.createdTimestamp)) / 1000)} ms`, true)
        .addField("Delay da API", `${Math.round(interaction.client.ws.ping)} ms`, true)
        .setTimestamp();
        
        await interaction.reply({embeds: [embed]})
    }
}