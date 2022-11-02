
const {MessageEmbed}=require("discord.js");

module.exports={
    name: "bitrate",

    async execute(interaction, client, args){
        if(client.lobbies.has(interaction.user.id)){
            const lobby=client.lobbies.get(interaction.user.id);
            const bitrate_value=interaction.options.getInteger("bitrate");
            if(bitrate_value >= 8 && bitrate_value <= 96){
                lobby.channel.setBitrate(bitrate_value * 1000)
                .then(()=>{
                    const embed=new MessageEmbed()
                    .setColor("#2a5bc5")
                    .setTitle(`Agora seu lobby tem a taxa de bits de ${lobby.channel.bitrate} kbps.`);

                    interaction.reply({embeds: [embed], ephemeral: true})
                })
                .catch(err=> {
                    interaction.reply({content: `Ocorreu um erro na execução:\n\`\`\`${err}\`\`\``, ephemeral: true});
                });
            }else
                await interaction.reply({content: `<@${interaction.user.id}>  A taxa de bits do canal **precisa** ser entre **8 e 96**;`, ephemeral: true})
        }else
            await interaction.reply({content: `<@${interaction.user.id}> você não tem um lobby criado.`, ephemeral: true})
    }
}