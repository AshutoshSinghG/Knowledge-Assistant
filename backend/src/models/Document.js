const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

documentSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Document', documentSchema);
