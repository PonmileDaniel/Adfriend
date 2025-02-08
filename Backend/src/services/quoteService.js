const { generateContent } = require('./geminiService')

/**
 * Fetches a motivational quote from Gemini Ai
 * @returns {Promise<string>} - AI-generated quote.
 */

const getMotivationalQuote = async () => {
    const prompt = "Give me a short, inspiring motivational quote."
    return await generateContent(prompt)
}
module.exports = { getMotivationalQuote }