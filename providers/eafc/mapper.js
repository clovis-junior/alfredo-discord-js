const positions = {
    goalkeeper: {
        id: 0,
        name: 'Goleiro'
    },
    defender: {
        id: 5,
        name: 'Zagueiro'
    },
    midfielder: {
        id: 14,
        name: 'Meio-Campo'
    },
    forward: {
        id: 25,
        name: 'Atacante'
    }
};

function getPositionByKey(key) {
    return positions?.[key]?.name || null
}

function getPositionById(id) {
    const result = Object.values(positions).find(
        position => position.id === Number(id)
    );

    return result?.name || null
}

function player(member) {
    return {
        name: member?.name,
        proName: member?.proName,
        favoritePosition: getPositionByKey(member?.favoritePosition),
        position: getPositionById(member?.proPos),
        overall: Number(member?.proOverall),
        games: Number(member?.gamesPlayed),
        winRate: Number(member?.winRate),
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