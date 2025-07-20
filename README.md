# Discord AI Bot

A Python-based Discord bot that integrates with Gemini API for Q&A and Hugging Face for image generation.

## Features

- `/ask <question>`: Get answers from the Gemini API.
- `/generate_image <prompt>`: Generate images using Hugging Face.
- `/help`: List available commands.
- Dynamic server count in bot status.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_API_URL=your_gemini_api_url
   DISCORD_BOT_TOKEN=your_discord_bot_token
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   ```
4. Run the bot:
   ```bash
   python main.py
   ```

## Deployment

- Includes `Procfile` and `runtime.txt` for Heroku deployment.

## License

See [LICENSE](LICENSE).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security Policy

See [SECURITY.md](SECURITY.md).
