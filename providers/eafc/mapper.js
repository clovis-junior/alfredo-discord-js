const positions = {
    goalkeeper: 'Goleiro',
    defender: 'Defensor',
    midfielder: 'Meio-Campista',
    forward: 'Atacante'
};

function player(member) {
    return {
        name: String(member?.name),
        proName: String(member?.proName),
        favoritePosition: String(member?.favoritePosition),
        position: String(member?.favoritePosition),
        overall: Number(member?.proOverall),
        games: Number(member?.gamesPlayed),
        wins: Number(member?.winRate),
        goals: Number(member?.goals),
        assists: Number(member?.assists),
        rating: Number(member?.ratingAve),
        motm: Number(member?.manOfTheMatch),
        redCards: Number(member?.redCards)
    }
}

module.exports = {
    player
}