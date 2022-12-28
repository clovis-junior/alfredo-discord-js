const {EmbedBuilder}=require("discord.js");

module.exports={
    name: "unlock",
    aliases: ["open"],
    category: "voice",
    description: "",
    cooldown: 5,
    enabled: true,
    show: false,

    async execute(message, client){
        if(client.lobbies.has(message.author.id)){
            const lobby=client.lobbies.get(message.author.id);  
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
                embed.setTitle(`${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} está aberto para o público.`);

                lobby.lock=false;
                await message.channel.send({embeds: [embed]})
            }else
                await message.channel.send(`<@${message.author.id}> seu lobby já está aberto!`)
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}