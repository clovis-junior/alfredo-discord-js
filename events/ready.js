module.exports={
    name: "ready",
    once: true,

    async execute(client){
        console.log(`Logado no client ${client.user.username}\n-> Pronto para uso em ${client.guilds.cache.size} servidor(es) com ${client.users.cache.size} usuário(s) no total.`);
        //client.user.setActivity("The Batman", {type: "WATCHING"});
    }
    
}