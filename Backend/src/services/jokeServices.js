const { generateContent } = require('./geminiService')

/**
 * Fetches a motivational quote from Gemini Ai
 * @returns {Promise<string>} - AI-generated quote.
 */

const getJokesQuote = async () => {
    const prompt = "Tell me a brand new, original, and funny joke to brighten my day. Ensure that this joke hasn't been used before."
    return await generateContent(prompt)
}
module.exports = { getJokesQuote }