const express = require('express');
const { searchDocuments, buildContext } = require('../services/ragService');
const { generateAnswer } = require('../services/aiService');

const router = express.Router();

// ask a question
router.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === '') {
            return res.status(400).json({ error: 'Question is required' });
        }

        const relevantDocs = await searchDocuments(question, 5);

        const context = buildContext(relevantDocs);

        const answer = await generateAnswer(question, context);

        res.json({
            answer,
            sources: relevantDocs.map(doc => ({
                id: doc._id,
                title: doc.title,
                snippet: doc.content.substring(0, 150) + (doc.content.length > 150 ? '...' : '')
            }))
        });
    } catch (error) {
        console.error('Q&A error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to process question' });
    }
});

module.exports = router;
