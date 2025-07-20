require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, REST, Routes, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID; // Assuming CLIENT_ID is also in .env

const commands = [
    {
        name: 'ask',
        description: 'Ask a question to the Gemini API',
        options: [
            {
                name: 'question',
                type: 3, // String type
                description: 'The question to ask',
                required: true,
            },
        ],
    },
    {
        name: 'generate_image',
        description: 'Generate an image based on a prompt',
        options: [
            {
                name: 'prompt',
                type: 3, // String type
                description: 'The prompt for image generation',
                required: true,
            },
        ],
    },
    {
        name: 'help',
        description: 'Display information about available commands',
    },
];

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

// Initialize the bot with necessary intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message]
});

// Function to generate an image using Hugging Face API
async function generateImage(prompt) {
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            { inputs: prompt },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer' // Important for handling image data
            }
        );

        const contentType = response.headers['content-type'];

        if (contentType && contentType.startsWith('image')) {
            return response.data; // Return raw image buffer
        } else if (contentType === 'application/json') {
            const responseJson = JSON.parse(Buffer.from(response.data).toString());
            if (responseJson.generated_image) {
                return responseJson.generated_image;
            } else {
                return 'No image generated.';
            }
        } else {
            return `Unexpected response format: ${Buffer.from(response.data).toString()}`;
        }
    } catch (error) {
        if (error.response) {
            return `Error from Hugging Face API: ${error.response.status} - ${Buffer.from(error.response.data).toString()}`;
        } else {
            return `An error occurred: ${error.message}`;
        }
    }
}

// Function to get response from Gemini API
async function getGeminiResponse(question) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": question
                    }
                ]
            }
        ]
    };
    try {
        const response = await axios.post(GEMINI_API_URL, data, { headers });
        if (response.status === 200) {
            const candidates = response.data.candidates || [];
            if (candidates.length > 0) {
                const content = candidates[0].content || {};
                const parts = content.parts || [];
                if (parts.length > 0) {
                    return parts[0].text || 'No response from Gemini API.';
                }
            }
            return 'No valid response from Gemini API.';
        } else {
            return `Error communicating with Gemini API: ${response.status}`;
        }
    } catch (error) {
        return `An error occurred: ${error.message}`;
    }
}

// Event: Bot has connected to Discord
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Register slash commands globally
    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Failed to reload application (/) commands:', error);
    }

    // Set initial server count in the activity status
    const serverCount = client.guilds.cache.size;
    client.user.setActivity(`${serverCount} servers!`, { type: ActivityType.Streaming, url: "https://www.twitch.tv/valorant" });

    console.log(`Bot is in ${serverCount} guilds.`);
});

// Event: Handle interactions (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ask') {
        await interaction.deferReply();
        const question = options.getString('question');
        let answer = await getGeminiResponse(question);
        if (answer.length > 2000) {
            answer = answer.substring(0, 1997) + '...';
        }
        await interaction.followUp(answer);
    } else if (commandName === 'generate_image') {
        await interaction.deferReply();
        const prompt = options.getString('prompt');
        const imageData = await generateImage(prompt);

        if (Buffer.isBuffer(imageData)) {
            const attachment = new AttachmentBuilder(imageData, { name: 'generated_image.png' });
            await interaction.followUp({ files: [attachment] });
        } else {
            await interaction.followUp(imageData);
        }
    } else if (commandName === 'help') {
        const helpText = (
            "> \n"
            + "> **Basic Commands:**\n"
            + "> - `/ask <question>` Ask a question to the Gemini API and get an answer.\n"
            + "> - `/generate_image <prompt>` Generate an image based on a given prompt.\n"
            + "> \u200e \n"
        );
        await interaction.reply({ content: helpText, ephemeral: true });
    }
});

// Event: Update server count when bot joins a new server
client.on('guildCreate', guild => {
    const serverCount = client.guilds.cache.size;
    client.user.setActivity(`${serverCount} servers!`, { type: ActivityType.Streaming, url: "https://www.twitch.tv/valorant" });
    console.log(`Joined new guild: ${guild.name}. Total guilds: ${serverCount}`);
});

// Event: Update server count when bot leaves a server
client.on('guildDelete', guild => {
    const serverCount = client.guilds.cache.size;
    client.user.setActivity(`${serverCount} servers!`, { type: ActivityType.Streaming, url: "https://www.twitch.tv/valorant" });
    console.log(`Left guild: ${guild.name}. Total guilds: ${serverCount}`);
});

// Log in to Discord with your client's token
client.login(DISCORD_BOT_TOKEN); 