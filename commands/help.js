const { MessageFlags } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Display information about available commands',
    },
    async execute(interaction) {
        const helpText = (
            "> \n"
            + "> **Basic Commands:**\n"
            + "> - `/ask <question>` Ask a question to the Gemini API and get an answer.\n"
            + "> - `/generate_image <prompt>` Generate an image based on a given prompt.\n"
            + "> - `/invite` Get a link to invite the bot to your server.\n"
            + "> \u200e \n"
        );
        await interaction.reply({ content: helpText, flags: MessageFlags.Ephemeral });
    },
}; 