const { request } = require('./api');
const mapper = require('./mapper');

function calculatePlayerStats(players = []) {
    let topScorer = null;
    let topAssist = null;
    let bestRating = null;

    for (const player of players) {
        if (!topScorer || player.goals > topScorer.goals)
            topScorer = player;

        if (!topAssist || player.assists > topAssist.assists)
            topAssist = player;

        if (!bestRating || player.rating > bestRating.rating)
            bestRating = player;
    }

    return {
        playerCount: players.length,
        topScorer,
        topAssist,
        bestRating
    }
}

function generateClubResult(data = null, players = []) {
    if (!data) return null;

    return {
        id: Number(data?.clubId),
        name: data?.clubInfo?.name || data?.name,
        stadium: data?.clubInfo?.customKit?.stadName,
        stats: {
            goals: Number(data?.goals) || 0,
            goalsAgainst: Number(data?.goalsAgainst) || 0,
            goalsAverage: Number(data?.goals / data?.gamesPlayed) || 0,
            goalsAgainstAvarage: Number(data?.goalsAgainst / data?.gamesPlayed) || 0,
            goalsDifference: Number(data?.goals - data?.goalsAgainst) || 0,
            cleanSheets: Number(data?.cleanSheets) || 0,
            games: Number(data?.gamesPlayed),
            wins: Number(data?.wins),
            losses: Number(data?.losses),
            ties: Number(data?.ties),
            winRate: Number((data?.wins / data?.gamesPlayed) * 100) || 0,
            ...calculatePlayerStats(players || [])
        }
    }
}

async function searchById(clubId) {
    if (!clubId)
        throw new Error('Club ID is required');

    const data = await request(
        `/clubs/info?platform=common-gen5&clubIds=${clubId}`
    );

    return data?.[clubId] || null
}

async function searchByName(name) {
    if (!name)
        throw new Error('Name is required');

    const data = await request(
        `/allTimeLeaderboard/search?platform=common-gen5&clubName=${encodeURIComponent(name)}`
    );

    return data?.[0] || null
}

async function getByName(name) {
    const clubInfos = await searchByName(name);
    const players = await getMembers(clubInfos?.clubId);

    return generateClubResult(clubInfos, players)
}

async function getById(clubId) {
    const [clubInfos, players] =
        await Promise.all([
            searchById(clubId),
            getMembers(clubId)
        ]);

    return generateClubResult(clubInfos, players)
}

async function getMembers(clubId) {
    if (!clubId)
        throw new Error('Club ID is required');

    const response = await request(`/members/stats?platform=common-gen5&clubId=${clubId}`);

    return response?.members?.map(
        mapper.player
    ) || [];
}

module.exports = {
    getByName,
    getById
}