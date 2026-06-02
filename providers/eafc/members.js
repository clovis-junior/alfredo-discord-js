const { getClubCareer, getMembers } = require('./clubs');

function normalize(name) {
    return name
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')
        ?.toLowerCase()
        ?.trim()
}

async function getMemberCareer(clubId, search) {
    if (!clubId)
        throw new Error('Club ID is required');

    if (!search)
        throw new Error('Search term is required');

    const data = await getClubCareer(clubId);
    const term = normalize(search);

    return data?.members?.find(member =>
        normalize(member?.name)?.includes(term)
    )
}

async function findByName(clubId, search) {
    if (!clubId)
        throw new Error('Club ID is required');

    if (!search)
        throw new Error('Search term is required');

    const data = await getMembers(clubId);
    const term = normalize(search);

    return data?.find(member =>
        normalize(member?.name)?.includes(term)
    )
}

module.exports = {
    getMemberCareer,
    findByName
};