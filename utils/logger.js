const {
    WebhookClient
} = require('discord.js');

let webhookClient;

function initializeLogger(channelId, token) {
    if (channelId && token) {
        webhookClient = new WebhookClient({
            id: channelId,
            token: token
        });
        console.log('Logger initialized with Discord webhook.');
    } else {
        console.log('Discord log channel ID or token not provided. Logging to console only.');
    }
}

async function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    let logContent;

    if (message instanceof Error) {
        logContent = `[${timestamp}] [${type.toUpperCase()}] Error: ${message.message}\n${message.stack}`;
    } else {
        logContent = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    }

    console.log(logContent);

    if (webhookClient) {
        try {
            await webhookClient.send({
                content: logContent,
            });
        } catch (error) {
            console.error('Failed to send log to Discord webhook:', error);
        }
    }
}

module.exports = {
    initializeLogger,
    log,
}; 