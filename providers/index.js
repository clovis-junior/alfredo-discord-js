const providers = [
    require('./eafc')
];

function getChoices() {
    return providers.map(provider => ({
        name: provider.name,
        value: provider.id
    }))
}

function getById(id) {
    return providers.find(provider => provider.id === id)
}

module.exports = {
    getChoices,
    providers,
    getById
}