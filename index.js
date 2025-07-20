require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, REST, Routes, MessageFlags, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { initializeLogger, log } = require('./utils/logger');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_ACTIVITY_TYPE = process.env.DISCORD_ACTIVITY_TYPE || 'Playing'; // Default to 'Playing'
const DISCORD_ACTIVITY_URL = process.env.DISCORD_ACTIVITY_URL || null;
const DISCORD_LOG_CHANNEL_ID = process.env.DISCORD_LOG_CHANNEL_ID;
const DISCORD_LOG_TOKEN = process.env.DISCORD_LOG_TOKEN;

// Initialize the logger immediately with the retrieved environment variables
initializeLogger(DISCORD_LOG_CHANNEL_ID, DISCORD_LOG_TOKEN);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.commands = new Map();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        log(`The command at ${filePath} is missing a required "data" or "execute" property.`, 'warn');
    }
}

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

client.once('ready', async () => {
    log(`Logged in as ${client.user.tag}!`, 'info');
    try {
        const commandsToRegister = Array.from(client.commands.values()).map(command => command.data);
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commandsToRegister },
        );
        log('Successfully reloaded application (/) commands.', 'info');
    } catch (error) {
        log(`Failed to reload application (/) commands: ${error.message}`, 'error');
    }

    const serverCount = client.guilds.cache.size;
    const activityOptions = {
        type: ActivityType[DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' ? 'Streaming' : DISCORD_ACTIVITY_TYPE],
    };

    if (DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' && DISCORD_ACTIVITY_URL) {
        activityOptions.url = DISCORD_ACTIVITY_URL;
    }

    client.user.setActivity(`${serverCount} souls!`, activityOptions);
    log(`Bot is in ${serverCount} guilds.`, 'info');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        log(`No command matching ${interaction.commandName} was found.`, 'warn');
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        log(error, 'error'); // Pass the full error object
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000) // Red color
            .setTitle('Command Error')
            .setDescription('There was an error while executing this command! Please check the logs for more details.')
            .setTimestamp();

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    }
});

client.on('guildCreate', guild => {
    const serverCount = client.guilds.cache.size;
    const activityOptions = {
        type: ActivityType[DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' ? 'Streaming' : DISCORD_ACTIVITY_TYPE],
    };

    if (DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' && DISCORD_ACTIVITY_URL) {
        activityOptions.url = DISCORD_ACTIVITY_URL;
    }
    client.user.setActivity(`${serverCount} souls!`, activityOptions);
    log(`Joined new guild: ${guild.name}. Total guilds: ${serverCount}`, 'info');
});

client.on('guildDelete', guild => {
    const serverCount = client.guilds.cache.size;
    const activityOptions = {
        type: ActivityType[DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' ? 'Streaming' : DISCORD_ACTIVITY_TYPE],
    };

    if (DISCORD_ACTIVITY_TYPE.toUpperCase() === 'STREAMING' && DISCORD_ACTIVITY_URL) {
        activityOptions.url = DISCORD_ACTIVITY_URL;
    }
    client.user.setActivity(`${serverCount} souls!`, activityOptions);
    log(`Left guild: ${guild.name}. Total guilds: ${serverCount}`, 'info');
});

client.login(DISCORD_BOT_TOKEN);