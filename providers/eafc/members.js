const { getClubCareer, getMembers } = require('./clubs');

function normalize(name) {
  return name
    ?.normalize('NFD')
    ?.replace(/[\u0300-\u036f]/g, '')
    ?.toLowerCase()
    ?.trim()
}

async function findByName(clubId, search) {
  if (!clubId || !search) return null;

  const data = await getMembers(clubId);
  const term = normalize(search);

  return data?.find(member =>
    normalize(member?.name)?.includes(term) ||
    normalize(member?.proName)?.includes(term)
  )
}

module.exports = {
  findByName
};