module.exports={
    name: "messageCreate",
    once: false,

    async execute(client, message){
        if(message.channel.type == "dm") return;
        if(!message.guild || message.author.bot) return;
    
        const prefix="!";
    
        if(!prefix.includes(message.content.charAt(0))) return;
    
        const params=message.content.trim().slice(prefix.length).split(/\s+/);
        let command=params.shift().toLowerCase();
    
        command=client.commands.get(command) || client.commands.find(cmd=> cmd.aliases && cmd.aliases.includes(command));
    
        if(!command) return;
        
        try{
            if(!command.enabled) return;
            if(command.cooldown && command.cooldown > 0){
                if(client.cooldown.has(message.author.id))
                    return message.channel.send(`<@${message.author.id}> espere ${command.cooldown + (command.cooldown > 1 ? " segundos" : " segundo")} para usar o \`${command.name}\` de novo.`);
                else{
                    client.cooldown.add(message.author.id);
                    setTimeout(()=>{
                        client.cooldown.delete(message.author.id)
                    }, Math.abs(command.cooldown * 1000))
                } 
            }
    
            await command.execute(message, client, params);
        }catch(err){
            console.error(err);
            //await message.reply({content: `Ocorreu um erro na execução:\n*${err}*`, ephemeral: true});
        }
    
        if(message.deletable) message.delete();
    }
}