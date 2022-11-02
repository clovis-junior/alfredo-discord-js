module.exports={
    name: "interactionCreate",
    once: false,

    async execute(client, interaction){
        if(!interaction.isCommand()) return;
        if(!client.interactions.has(interaction.commandName)) return;    
    
        try{
            //await interaction.defer({ephemeral: true}).catch(()=> {});
            const args=[];
            interaction.options.data.map(option=>{
                args.push(option.name);
            });

            //console.log(args);
    
            await client.interactions.get(interaction.commandName).execute(interaction, client, args);   
        }catch(err){
            await interaction.reply({content: `Ocorreu um erro na execução:\n\`\`\`${err}\`\`\``, ephemeral: true});
        }    
    }
}