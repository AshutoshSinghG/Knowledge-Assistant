const Document = require('../models/Document');

const searchDocuments = async (query, limit = 5) => {
    if (!query || query.trim() === '') {
        return [];
    }

    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);

    if (keywords.length === 0) {
        const docs = await Document.find().sort({ createdAt: -1 }).limit(limit);
        return docs;
    }

    // try text search first
    let results = await Document.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit);

    // fallback to regex search if no text matches
    if (results.length === 0) {
        const regexPatterns = keywords.map(word => new RegExp(word, 'i'));
        results = await Document.find({
            $or: [
                { title: { $in: regexPatterns } },
                { content: { $in: regexPatterns } },
                { tags: { $in: keywords } }
            ]
        })
            .limit(limit);
    }

    return results;
};

const buildContext = (documents) => {
    if (!documents || documents.length === 0) {
        return '';
    }

    return documents.map((doc, index) => {
        return `Document ${index + 1}: ${doc.title}\n${doc.content}`;
    }).join('\n\n---\n\n');
};

module.exports = {
    searchDocuments,
    buildContext
};
