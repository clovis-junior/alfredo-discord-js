
<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

module.exports={
    name: "limit",

    async execute(interaction, client, args){
        if(client.lobbies.has(interaction.user.id)){
            const lobby=client.lobbies.get(interaction.user.id);
            const limit=interaction.options.getInteger("quantidade");
            if(limit <= 99){
                lobby.channel.setUserLimit(limit)
                .then(()=>{
<<<<<<< HEAD
                    const embed=new MessageEmbed()
=======
                    const embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
                    .setColor("#2a5bc5")
                    .setTitle(`Agora seu lobby comporta ${limit ? limit : "número ilimitado de"} pessoa(s).`);

                    interaction.reply({embeds: [embed], ephemeral: true})
                })
                .catch(err=> {
                    interaction.reply({content: `Ocorreu um erro na execução:\n\`\`\`${err}\`\`\``, ephemeral: true});
                });
            }else
                await interaction.reply({content: `<@${interaction.user.id}> o valor **precisar** ser de **0 a 99**.`, ephemeral: true})
        }else
            await interaction.reply({content: `<@${interaction.user.id}> você não tem um lobby criado.`, ephemeral: true})
    }
}