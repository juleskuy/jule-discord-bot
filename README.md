# Discord AI Bot

A Node.js-based Discord bot that integrates with Google Gemini API for Q&A and Hugging Face for image generation.

## Features

- `/ask <question>`: Get answers from the Google Gemini API (using `gemini-2.0-flash`).
- `/generate_image <prompt>`: Generate images using Hugging Face (using `stabilityai/stable-diffusion-xl-base-1.0`).
- `/help`: List all available commands.
- `/invite`: Get a link to invite the bot to your server.
- Dynamic server count in bot status.
- Configurable bot activity status.
- Detailed logging to a private Discord channel.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Based on the provided `.env.example` or the following:

    ```
    # Discord Bot Configuration
    DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
    CLIENT_ID=YOUR_DISCORD_CLIENT_ID

    # Google Gemini API Configuration
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # Hugging Face API Configuration
    HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_API_KEY

    # Bot Activity Status (Optional)
    # Examples: Playing, Streaming, Listening, Watching, Competing
    DISCORD_ACTIVITY_TYPE=Playing
    DISCORD_ACTIVITY_URL=null # Only for 'Streaming' type, e.g., https://www.twitch.tv/yourchannel

    # Discord Logging Channel (Optional)
    # Get CHANNEL_ID by right-clicking the channel in Discord and selecting "Copy ID" (Developer Mode must be enabled)
    DISCORD_LOG_CHANNEL_ID=YOUR_DISCORD_LOG_CHANNEL_ID
    # Get WEBHOOK_TOKEN from the Webhook URL (e.g., https://discord.com/api/webhooks/CHANNEL_ID/WEBHOOK_TOKEN)
    DISCORD_LOG_TOKEN=YOUR_DISCORD_LOG_TOKEN
    ```

    **Important:** Ensure your Discord Bot has the `applications.commands` OAuth2 scope enabled in the Discord Developer Portal for slash commands to work.

4.  **Run the bot:**

    ```bash
    node index.js
    ```

## Deployment

This bot is designed for deployment on platforms like [Railway](https://railway.app/) or similar Node.js hosting services. Ensure your environment variables are correctly configured on your chosen platform.

## License

See [LICENSE](LICENSE).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security Policy

See [SECURITY.md](SECURITY.md).
