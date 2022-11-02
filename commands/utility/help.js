const {MessageEmbed}=require("discord.js");

module.exports={
    name: "help",
    aliases: ["h"],
    category: "",
    description: "",
    cooldown: 10,
    enabled: true,
    show: false,

    async execute(message, client, args){
        let embed;
        if(!args[0]){
            const commands=client.commands.filter(command=> command.enabled !== false && command.show !== false);

            embed=new MessageEmbed()
            .setColor("#2a5bc5");

            if(!commands)
                embed.setTitle(`Não tenho nenhum comando disponível.`);  
            else{
                //.setAuthor("Lista de Comandos", client.user.displayAvatarURL({size: 32, dynamic: true}));
                embed.setDescription("Comece o comando com o prefixo definido.\nPara mais informações, dê o comando de ajuda junto à um dos comandos da lista.\nEx: \"{prefixo}help {comando}\" (sem aspas).");
                embed.addField(`Comandos`, commands.map(c=> `-> ${c.name} ${(c.aliases && c.aliases.length > 0) ? `(${c.aliases.map(a=> a).join(", ")})` : ""}`).join("\n"));
                embed.setTimestamp()
            }   
        }else{
            const command=client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd=> cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

            embed=new MessageEmbed()
            .setColor("#2a5bc5");

            if(command){
                embed.setTitle(`Comando "${command.name}"`);
                embed.setDescription(command.description.length > 0 ? command.description : "Sem descrição");

                if(command.aliases && command.aliases.length > 0)
                    embed.addField("Outras chamadas", command.aliases.map(a=> a).join(", "));

                if(command.category && command.category.length > 0)
                    embed.addField("Categoria", command.category);

                if(command.cooldown)
                    embed.addField("Tempo de espera", command.cooldown > 0 ? command.cooldown + (command.cooldown > 1 ? " segundos" : " segundo") : "nenhum");

                embed.setTimestamp()
            }else
                embed.setTitle(`O comando "${args[0].toLowerCase()}" não existe!`);  
        }

        message.channel.send({embeds: [embed]});
    }
}