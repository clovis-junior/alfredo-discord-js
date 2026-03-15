module.exports = function getEmbedColor(interaction) {
    return (
        interaction.guild?.members?.me?.displayColor ||
        interaction.member?.displayColor ||
        '#2a5bc5'
    );
}