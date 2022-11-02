const {MessageEmbed}=require("discord.js");

module.exports={
    name: "lobby",

    async execute(interaction, client, args){
        if(!args || !client.interactions.has(args[0])) return;

        await client.interactions.get(args[0]).execute(interaction, client, args);
    }
}