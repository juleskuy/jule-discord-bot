const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

        await interaction.reply({ content: 'Invite me to your server!', components: [row] });
    },
}; 