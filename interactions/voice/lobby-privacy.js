const {EmbedBuilder}=require("discord.js");

module.exports={
    name: "privacy",

    async execute(interaction, client, args){
        if(client.lobbies.has(interaction.user.id)){
            const lobby=client.lobbies.get(interaction.user.id);
            const embed=new EmbedBuilder();
            
            if(lobby.lock){
                lobby.channel.permissionOverwrites.set([
                    {
                        id: lobby.guild.roles.everyone,
                        allow: "CONNECT",
                        deny: ["MANAGE_CHANNELS", "MOVE_MEMBERS"]
                    }
                ]);
                embed.setColor("#4fa03f");
                embed.setTitle(`${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} está aberto para o público.`)
            }else{
                lobby.channel.permissionOverwrites.set([
                    {
                        id: lobby.guild.roles.everyone,
                        deny: ["CONNECT", "MANAGE_CHANNELS", "MOVE_MEMBERS"]
                    }
                ]);
                embed.setColor("#d83749");
                embed.setTitle(`${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} está fechado para o público.`)
            }

            lobby.lock=!lobby.lock;
            await interaction.reply({embeds: [embed]})
        }else
            await interaction.reply({content: `<@${interaction.user.id}> você não tem um lobby criado.`, ephemeral: true})
    }
}