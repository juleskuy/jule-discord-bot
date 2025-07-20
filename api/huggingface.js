const { HfInference } = require("@huggingface/inference");

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const SDXL_BASE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
// const SDXL_REFINER_MODEL = "stabilityai/stable-diffusion-xl-refiner-1.0"; // Temporarily removed due to provider issues

// Initialize the Hugging Face Inference client
const hf = new HfInference(HUGGINGFACE_API_KEY);

async function generateImage(prompt) {
    if (!HUGGINGFACE_API_KEY) {
        return 'Hugging Face API key is not configured. Please set HUGGINGFACE_API_KEY in your environment variables.';
    }
    try {
        // Step 1: Generate image with the base model
        const imageData = await hf.textToImage({
            model: SDXL_BASE_MODEL,
            inputs: prompt,
        });

        // Step 2: Refinement step temporarily removed due to provider issues
        // const refinedImageData = await hf.textToImage({
        //     model: SDXL_REFINER_MODEL,
        //     inputs: prompt,
        //     image: baseImageData,
        // });

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