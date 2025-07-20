const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'invite',
        description: 'Invite the bot to your server!',
    },
    async execute(interaction) {
        const inviteLink = 'https://discord.com/oauth2/authorize?client_id=1073523000638447696&permissions=8&integration_type=0&scope=bot+applications.commands';

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(inviteLink),
            );

        const embed = new EmbedBuilder()
            .setColor(0x00FF99) // Greenish color
            .setTitle('Invite the Bot!')
            .setDescription('Click the button below to invite me to your server.')
            .setURL(inviteLink) // Set URL on the embed title as well
            .setTimestamp()
            .setFooter({ text: 'Thank you for inviting!' });

        await interaction.reply({ embeds: [embed], components: [row] });
    },
}; 