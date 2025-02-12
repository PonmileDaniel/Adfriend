const { getMotivationalQuote } = require('../services/quoteService');
const { getDSAQuestion } = require('../services/dsaService');

/**
 * Handles AI content generation
 * @param {Request} req - Express request object.
 * @param {Response} res - Express responsse object.
 */

const getContent = async (req, res) => {
    try {
        const { type } = req.query;
        console.log("Request type", type)

        if (!type) {
            return res.status(400).json({ error: "Type parameter is required." });
        }

        let content;
        if (type === 'quote') {
            content = await getMotivationalQuote();
        }
        else if (type === 'dsa') {
            content = await getDSAQuestion();
        }
        else {
            return res.status(400).json({ error: "Invalid type. Use 'quote' or 'dsa'." });
        }
        let cleanContent = content.replace(/\*\*/g, "").replace(/\n+/g, " ").trim();

        // ✅ Ensure response starts with "DSA Question:"
        if (type === "dsa") {
            cleanContent = cleanContent.replace(/^.*?Question:/i, "").trim(); // Remove AI intro
            cleanContent = `DSA Question: ${cleanContent}`;
        }
        res.json({ content: cleanContent })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

module.exports = { getContent };