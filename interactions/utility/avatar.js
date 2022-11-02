const {MessageEmbed}=require("discord.js");

const model=(member, user)=>{
    return embed=new MessageEmbed()
    .setColor(member.displayColor || "#2a5bc5")
    .setTitle(`Avatar de ${member.displayName}`)
    .setURL(user.avatarURL({size: 1024, dynamic: true}))
    .setImage(user.avatarURL({size: 512, dynamic: true}));
};

module.exports={
    name: "avatar",

    async execute(interaction){
        if(interaction.options.data.map(user=>user).length > 0){
            await interaction.deferReply();

            await interaction.options.data.map(({user}) => user).forEach(user=>{
                interaction.followUp({embeds: [model(interaction.guild.members.cache.get(user.id), user)]})
            })
        }else
            await interaction.reply({embeds: [model(interaction.member, interaction.user)]});
    }
}