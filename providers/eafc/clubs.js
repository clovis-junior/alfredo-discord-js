const { request } = require('./api');
const mapper = require('./mapper');

const EA_GAMES_CDN = {
    'fc24': {
        base: 'https://eafc24.content.easports.com/fifa/fltOnlineAssets/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fcweb'
    },
    'fc25': {
        base: 'https://eafc25.content.easports.com/fifa/fltOnlineAssets/7A14B8C1-8526-4B1C-A239-E549F2DB1C90/2025/fcweb'
    },
    'fc26': {
        base: 'https://eafc26.content.easports.com/fifa/fltOnlineAssets/CC8261CD-39FE-48C6-A575-3FA087F293FA/2026/fc/dist'
    }
};

const NOT_FOUND = 'https://media.contentapi.ea.com/content/dam/eacom/fc/pro-clubs/notfound-crest.png';

async function generateURLEmblem(clubId, crestAssetId) {
    if (!clubId || !crestAssetId)
        return NOT_FOUND;

    const fcVersion = detectFcVersion(clubId);
    const cdn = EA_GAMES_CDN[fcVersion];

    const resultURL = `${cdn.base}/crests/256x256/l${crestAssetId}.png`;

    try {
        const response = await fetch(resultURL, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0'
            },
            timeout: 5000
        });

        return response.status === 200 ? resultURL : NOT_FOUND;
    } catch (err) {
        console.warn(err);
        return NOT_FOUND
    }
}

function detectFcVersion(clubId = 0) {
    if (clubId < 100000)
        return 'fc24';
    else if (clubId >= 100000 && clubId < 1500000)
        return 'fc24';
    else if (clubId >= 1500000 && clubId < 4000000)
        return 'fc25';
    else
        return 'fc26';
}

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

async function generateClubResult(data = null, players = []) {
    if (!data) return null;

    const emblemURL = await generateURLEmblem(data?.clubId, data?.clubInfo?.customKit?.crestAssetId);

    return {
        id: Number(data?.clubId),
        name: data?.clubInfo?.name || data?.name,
        stadium: data?.clubInfo?.customKit?.stadName,
        emblem: emblemURL,
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
    if (!clubId) return null;

    const data = await request(
        `/clubs/info?platform=common-gen5&clubIds=${clubId}`
    );

    return data?.[clubId] || null
}

async function searchByName(name) {
    if (!name) return null;

    const data = await request(
        `/allTimeLeaderboard/search?platform=common-gen5&clubName=${encodeURIComponent(name)}`
    );

    return data?.[0] || null
}

async function getByName(name) {
    const clubInfos = await searchByName(name);
    const players = await getMembers(clubInfos?.clubId);

    return await generateClubResult(clubInfos, players)
}

async function getById(clubId) {
    const [clubInfos, players] =
        await Promise.all([
            searchById(clubId),
            getMembers(clubId)
        ]);

    return await generateClubResult(clubInfos, players)
}

async function getMembers(clubId) {
    if (!clubId) return null;

    const response = await request(`/members/stats?platform=common-gen5&clubId=${clubId}`);

    return response?.members?.map(
        mapper.player
    ) || []
}

module.exports = {
    getMembers,
    getByName,
    getById
}