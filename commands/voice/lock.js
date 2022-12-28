const {EmbedBuilder}=require("discord.js");

module.exports={
    name: "lock",
    aliases: ["close"],
    category: "voice",
    description: "",
    cooldown: 5,
    enabled: true,
    show: false,

    async execute(message, client){
        if(client.lobbies.has(message.author.id)){
            const lobby=client.lobbies.get(message.author.id);  
            const embed=new EmbedBuilder();
            if(!lobby.lock){
                lobby.channel.permissionOverwrites.set([
                    {
                        id: lobby.guild.roles.everyone,
                        deny: ["CONNECT", "MANAGE_CHANNELS", "MOVE_MEMBERS"]
                    }
                ]);
                embed.setColor("#d83749");
                embed.setTitle(`${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} está fechado para o público.`);

                lobby.lock=true;
                await message.channel.send({embeds: [embed]})
            }else
                await message.channel.send(`<@${message.author.id}> seu lobby já está fechado!`)
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}