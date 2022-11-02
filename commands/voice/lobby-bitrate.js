const {MessageEmbed}=require("discord.js");

module.exports={
    name: "bitrate",
    aliases: ["br"],
    category: "voice",
    description: "",
    cooldown: 20,
    enabled: true,
    show: true,

    async execute(message, client, args){
        if(client.lobbies.has(message.author.id)){
            const lobby=client.lobbies.get(message.author.id);
            
            if(args[0] && (parseInt(args[0]) > 7 || parseInt(args[0]) < 97))
                lobby.channel.setBitrate(parseInt(args[0]) * 1000)
                .then(()=>{
                    const embed=new MessageEmbed()
                    .setColor("#2a5bc5")
                    .setTitle(`Agora ${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} tem a taxa de bits de ${lobby.channel.bitrate} kbps.`);

                    message.channel.send({embeds: [embed]})
                })
                .catch(console.error);
            else 
                await message.channel.send(`<@${message.author.id}> A taxa de bits do canal **${lobby.channel.name}** é de *${lobby.channel.bitrate} kbps*.`);
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}