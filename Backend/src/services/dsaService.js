const { generateContent } = require('./geminiService')

/**
 * Fetches a coding interview-style DSA question.
 * @returns {Promise<string>} - AI-generated quote.
 */

const getDSAQuestion = async () => {
    const prompt = "Give me a coding interview question related to Data Structure and Algorithms and make it short.";
    return await generateContent(prompt)
}

module.exports = { getDSAQuestion }