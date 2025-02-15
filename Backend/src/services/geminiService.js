const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generates content using Gemini AI.
 * @param {string} prompt - The user's prompt/question
 * @returns {Promise<Strig>} - AI-generated response
 */
const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        console.log(result)
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error ('Failed to generate Ai content')
    }
};

module.exports = { generateContent };






