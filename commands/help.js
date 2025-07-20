const { MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Display information about available commands',
    },
    async execute(interaction) {
        const helpText = (
            "- `/ask <question>` Ask a question to the Gemini API and get an answer.\n"
            + "- `/generate_image <prompt>` Generate an image based on a given prompt.\n"
            + "- `/invite` Get a link to invite the bot to your server.\n"
        );

        const embed = new EmbedBuilder()
            .setColor(0x3366FF) // A different blue color
            .setTitle('Bot Commands')
            .setDescription(helpText)
            .setTimestamp()
            .setFooter({ text: 'Type a command to learn more' });

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
}; 