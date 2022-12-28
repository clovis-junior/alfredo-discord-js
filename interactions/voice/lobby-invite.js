
<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");

const model=(member, channel)=>{
    return embed=new MessageEmbed()
=======
const {EmbedBuilder}=require("discord.js");

const model=(member, channel)=>{
    return embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
    .setColor(member.displayColor || "#2a5bc5")
    .setTitle(`Você convidou ${member.displayName} para seu lobby.`)
};

module.exports={
    name: "invite",

    async execute(interaction, client, args){
        if(client.lobbies.has(interaction.user.id)){
            const lobby=client.lobbies.get(interaction.user.id),
                user=interaction.options.getUser("pessoa");

            lobby.channel.permissionOverwrites.create(user.id, {
                "CONNECT": true
            })
            .then(()=>{
                interaction.reply({embeds: [model(interaction.guild.members.cache.get(user.id), lobby.channel)], ephemeral: true})
            });
        }else
            await interaction.reply({content: `<@${interaction.user.id}> você não tem um lobby criado.`, ephemeral: true})
    }
}