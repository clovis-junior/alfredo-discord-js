const { Application } = require("discord.js");

module.exports={
    name: "deploy",
    description: "",
    enabled: true,
    show: false,

    async execute(message, client){
        if(!client.application?.owner) await client.application?.fetch();

        const data=[{
            name: "ping",
            description: "Mostra o ping da API."
        }, {
            name: "admin",
            description: "Exclui todas as mensagens do canal.",
            permission: 0x8,
            options: [{
                type: "SUB_COMMAND",
                name: "clear",
                description: "Exclui todas as mensagens do canal."
            }]
        }, {
            name: "avatar",
            description: "Mostra o avatar da(s) pessoa(s) mencionada(s).",
            options: [{
                type: "USER",
                name: "pessoa",
                description: "Pessoa para pegar o avatar.",
                required: false
            }]
        }, {
            name: "lobby",
            description: "Comandos para ajustar seu lobby.",
            options: [{
                type: "SUB_COMMAND",
                name: "privacy",
                description: "Ajusta o acesso do seu lobby.",
                options: [{
                    type: "BOOLEAN",
                    name: "public",
                    description: "Habilita/Desabilita o acesso do lobby ao público.",
                    require: true
                }]
            }, {
                type: "SUB_COMMAND",
                name: "invite",
                description: "Convida uma pessoa para seu lobby.",
                options: [{
                    type: "USER",
                    name: "pessoa",
                    description: "Pessoa para convidar.",
                    required: true
                }]
            }, {
                type: "SUB_COMMAND",
                name: "bitrate",
                description: "Altera o bitrate do seu lobby.",
                options: [{
                    type: "INTEGER",
                    name: "bitrate",
                    description: "Valor do bitrate.",
                    required: true
                }]
            }, {
                type: "SUB_COMMAND",
                name: "limit",
                description: "Define uma quantidade máxima de pessoas no seu lobby.",
                options: [{
                    type: "INTEGER",
                    name: "quantidade",
                    description: "Quantia de pessoas máxima no seu lobby.",
                    required: true
                }]
            }]
        }];

        try{
            await message.guild.commands.set(data);
            message.channel.send("Comandos com `/` foram implantados.")
        }catch(err){
            console.error(err)
        }
    }
}