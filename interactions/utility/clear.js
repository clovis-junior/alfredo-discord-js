module.exports={
    name: "clear",
    enabled: true,

    async execute(interaction){
        let size=0,
            fetch=interaction.channel.messages.fetch();

        await interaction.deferReply({ephemeral: true});

        fetch.then(messages=>{
            size=messages.size;
            for(let message of messages){
                if(!message[1].pinned && message[1].deletable)
                    message[1].delete();
            }
        });
        fetch.finally(()=>{
            interaction.followUp({content: `Excluí **${size} mensagem(ns)**.`})
        })
    }
}