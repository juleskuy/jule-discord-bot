const { HfInference } = require("@huggingface/inference");

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Initialize the Hugging Face Inference client
const hf = new HfInference(HUGGINGFACE_API_KEY);

async function generateImage(prompt) {
    if (!HUGGINGFACE_API_KEY) {
        return 'Hugging Face API key is not configured. Please set HUGGINGFACE_API_KEY in your environment variables.';
    }
    try {
        const imageData = await hf.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            inputs: prompt,
        });

        // The `imageData` returned by hf.textToImage is already a Blob or Buffer (depending on environment)
        // We need to convert it to a Buffer for AttachmentBuilder if it's a Blob in browser environments
        if (imageData instanceof Blob) {
            const arrayBuffer = await imageData.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } else {
            return imageData; // Already a Buffer in Node.js
        }

    } catch (error) {
        // Re-throw the error to be caught by the command handler for detailed logging
        throw error;
    }
}

module.exports = {
    generateImage,
}; 