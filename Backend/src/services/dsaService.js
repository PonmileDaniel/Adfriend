const { generateContent } = require('./geminiService')

/**
 * Fetches a coding interview-style DSA question.
 * @returns {Promise<string>} - AI-generated quote.
 */

const getDSAQuestion = async () => {
    const prompt = "Provide a unique, concise, and clear Data Structures and Algorithms (DSA) question suitable for a coding interview. Ensure the question is short and focuses on a specific concept.";
    return await generateContent(prompt)
}

module.exports = { getDSAQuestion }