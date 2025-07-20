const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const { generateImage } = require('../api/huggingface');
const { log } = require('../utils/logger');

module.exports = {
    data: {
        name: 'generate_image',
        description: 'Generate an image based on a prompt',
        options: [
            {
                name: 'prompt',
                type: ApplicationCommandOptionType.String,
                description: 'The prompt for image generation',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt');
        try {
            const imageData = await generateImage(prompt);

            if (Buffer.isBuffer(imageData)) {
                const attachment = new AttachmentBuilder(imageData, { name: 'generated_image.png' });
                await interaction.followUp({ files: [attachment] });
            } else {
                await interaction.followUp(imageData);
            }
        } catch (error) {
            log(`Error in generate_image command: ${error.message}`, 'error');
            await interaction.followUp('An error occurred while trying to generate an image. Please try again later.');
        }
    },
}; 