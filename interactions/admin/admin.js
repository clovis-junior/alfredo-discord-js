<<<<<<< HEAD
const {MessageEmbed}=require("discord.js");
=======
const {EmbedBuilder}=require("discord.js");
>>>>>>> ca5652c (Upload e organização de arquivos)

module.exports={
    name: "admin",

    async execute(interaction, client, args){
        if(!args || !client.interactions.has(args[0])) return;

        await client.interactions.get(args[0]).execute(interaction, client, args);
    }
}