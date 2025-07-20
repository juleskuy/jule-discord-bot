const { ApplicationCommandOptionType } = require('discord.js');
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
            await interaction.followUp(answer);
        } catch (error) {
            log(`Error in ask command: ${error.message}`, 'error');
            await interaction.followUp('An error occurred while trying to get a response from Gemini. Please try again later.');
        }
    },
}; 