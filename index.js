
/**
 * @name            Alfredo
 * @description     Alfredo bot for Discord, rewrited edition.
 * @author          Clovis Junior
 * @version         0.0.1
 * @since           2016
 */

/* ========================================================
    Packages
======================================================== */
require("dotenv").config();

const fs=require("fs");
const {Client, GatewayIntentBits, Collection}=require("discord.js");
const client=new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

client.commands=new Collection();
client.interactions=new Collection();
client.lobbies=new Collection();
client.cooldown=new Set();

/* Import Events ------------------------------------------ */
console.log("Carrengado eventos...");
const events=fs.readdirSync("./events").filter(file=> file.endsWith(".js"));
for(const file of events){
    const event=require(`./events/${file}`);

    if(event.once)
        client.once(event.name, (...args)=> event.execute(client, ...args));
    else
        client.on(event.name, (...args)=> event.execute(client, ...args));

    console.log(`-> Evento "${event.name}" carregado com sucesso!`);
    delete require.cache[require.resolve(`./events/${file}`)]
}

/* Import Commands ------------------------------------------ */
console.log("Carrengado comandos...");
const commands=fs.readdirSync("./commands");
for(const folder of commands){
	const commands=fs.readdirSync(`./commands/${folder}`).filter(file=> file.endsWith(".js"));

    for(const file of commands){
        const command=require(`./commands/${folder}/${file}`);
        client.commands.set(command.name.toLowerCase(), command);
        console.log(`-> Comando "${command.name}" carregado com sucesso!`);
        delete require.cache[require.resolve(`./commands/${folder}/${file}`)]
    }
}

/* Import Interarations ------------------------------------------ */
const interactions=fs.readdirSync("./interactions");
for(const folder of interactions){
	const interactions=fs.readdirSync(`./interactions/${folder}`).filter(file=> file.endsWith(".js"));

    for(const file of interactions){
        const interaction=require(`./interactions/${folder}/${file}`);
        client.interactions.set(interaction.name, interaction);
        delete require.cache[require.resolve(`./interactions/${folder}/${file}`)]
    }
}

/* ========================================================
    Events
======================================================== */
client.on("messageReactionAdd", async (reaction, user)=>{
    if(user.bot) return;
    if(!reaction.message.guild) return;

    if(reaction.message.id == "957847757148799000") {
        let blueTeamRole=reaction.message.guild.roles.cache.get("957833369226461185"),
            blueTeamEmoji="🟦", redTeamEmoji="🟥",
            redTeamRole=reaction.message.guild.roles.cache.get("957833440605139035");

        const member=reaction.message.guild.members.cache.get(user.id);

        if(reaction.emoji.name == blueTeamEmoji && !member.roles.cache.has(blueTeamRole.id))
            member.roles.add(blueTeamRole.id);

        if(reaction.emoji.name == redTeamEmoji && !member.roles.cache.has(redTeamRole.id))
            member.roles.add(redTeamRole.id);
    }
});
client.on("messageReactionRemove", async (reaction, user)=>{
    if(user.bot) return;
    if(!reaction.message.guild) return;

    if(reaction.message.id == "957847757148799000") {
        let blueTeamRole=reaction.message.guild.roles.cache.get("957833369226461185"),
            blueTeamEmoji="🟦", redTeamEmoji="🟥",
            redTeamRole=reaction.message.guild.roles.cache.get("957833440605139035");

        const member=reaction.message.guild.members.cache.get(user.id);

        if(reaction.emoji.name == blueTeamEmoji && member.roles.cache.has(blueTeamRole.id))
            member.roles.remove(blueTeamRole.id);

        if(reaction.emoji.name == redTeamEmoji && member.roles.cache.has(redTeamRole.id))
            member.roles.remove(redTeamRole.id);
    }
});
client.login(process.env.DISCORD_TOKEN)