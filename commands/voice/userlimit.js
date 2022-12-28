<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

module.exports={
    name: "userlimit",
    aliases: ["usrlmt"],
    category: "voice",
    description: "",
    cooldown: 2,
    enabled: true,
    show: true,

    async execute(message, client, args){
        if(client.lobbies.has(message.author.id)){
            const lobby=client.lobbies.get(message.author.id);
            
            if(args[0] && parseInt(args[0]) <= 99){
                lobby.channel.setUserLimit(parseInt(args[0]))
                .then(()=>{
<<<<<<< HEAD
                    const embed=new MessageEmbed()
=======
                    const embed=new EmbedBuilder()
>>>>>>> ca5652c (Upload e organização de arquivos)
                    .setColor("#2a5bc5")
                    .setTitle(`Agora ${lobby.channel.name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "")} comporta ${parseInt(args[0]) ? parseInt(args[0]): "número ilimitado de"} pessoa(s).`);

                    message.channel.send({embeds: [embed]})
                })
                .catch(console.error);
            }else
                await message.channel.send(`<@${message.author.id}> o valor tem que ser de 0 a 99.`)
        }else
            await message.channel.send(`<@${message.author.id}> você não tem um lobby criado.`)
    }
}