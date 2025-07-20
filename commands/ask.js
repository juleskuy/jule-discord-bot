const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getGeminiResponse } = require('../api/gemini');
const { log } = require('../utils/logger');

module.exports = {
    data: {
        name: 'ask',
        description: 'Ask a question to the Gemini API',
        options: [
            {
                name: 'question',
                type: ApplicationCommandOptionType.String,
                description: 'The question to ask',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        await interaction.deferReply();
        const question = interaction.options.getString('question');
        try {
            let answer = await getGeminiResponse(question);
            if (answer.length > 2000) {
                answer = answer.substring(0, 1997) + '...';
            }
            
            const embed = new EmbedBuilder()
                .setColor(0x0099FF) // Blue color
                .setDescription(answer)
                .setTimestamp()
                .setFooter({ text: 'Powered by Google Gemini' });

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            log(`Error in ask command: ${error.message}`, 'error');
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Red color
                .setTitle('Error')
                .setDescription('An error occurred while trying to get a response from Gemini. Please try again later.')
                .setTimestamp();
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
}; 