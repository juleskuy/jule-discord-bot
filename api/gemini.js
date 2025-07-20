const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function getGeminiResponse(question) {
    if (!GEMINI_API_KEY) {
        return 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.';
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();
        
        return text || 'No response from Gemini API.';
    } catch (error) {
        // Re-throw the error to be caught by the command handler for detailed logging
        throw error;
    }
}

module.exports = {
    getGeminiResponse,
}; 