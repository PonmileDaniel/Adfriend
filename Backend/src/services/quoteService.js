const { generateContent } = require('./geminiService')

/**
 * Fetches a motivational quote from Gemini Ai
 * @returns {Promise<string>} - AI-generated quote.
 */

const getMotivationalQuote = async () => {
    const prompt = "Generate a unique and inspirational motivational quote that encourages positivity, growth, and resilience. Ensure the quote is original and has not been repeated before."
    return await generateContent(prompt)
}
module.exports = { getMotivationalQuote }