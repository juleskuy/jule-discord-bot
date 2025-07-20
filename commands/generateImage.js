const { ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder } = require('discord.js');
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
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00) // Green color
                    .setTitle('Generated Image')
                    .setImage('attachment://generated_image.png') // Reference the attachment
                    .setDescription(`Prompt: "${prompt}"`) // Add the prompt to the description
                    .setTimestamp()
                    .setFooter({ text: 'Powered by Hugging Face' });

                await interaction.followUp({ embeds: [embed], files: [attachment] });
            } else {
                // This case should ideally be an error message or a specific non-image response
                const embed = new EmbedBuilder()
                    .setColor(0xFFFF00) // Yellow color for warning/info
                    .setTitle('Image Generation Info')
                    .setDescription(imageData) // imageData here is the error string or info message
                    .setTimestamp()
                    .setFooter({ text: 'Powered by Hugging Face' });
                await interaction.followUp({ embeds: [embed] });
            }
        } catch (error) {
            log(`Error in generate_image command: ${error.message}`, 'error');
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Red color
                .setTitle('Error')
                .setDescription('An error occurred while trying to generate an image. Please try again later.')
                .setTimestamp();
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
}; 