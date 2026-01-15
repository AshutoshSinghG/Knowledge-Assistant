const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');

const router = express.Router();

// configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// get all documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// get single document
router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid document ID' });
        }
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// create document from text
router.post('/', async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const document = new Document({
            title: title.trim(),
            content: content.trim(),
            tags: tags || []
        });

        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create document' });
    }
});

// upload PDF document
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }

        // parse PDF content
        const pdfData = await pdfParse(req.file.buffer);
        const content = pdfData.text.trim();

        if (!content) {
            return res.status(400).json({ error: 'Could not extract text from PDF' });
        }

        // use filename as title or custom title from body
        const title = req.body.title || req.file.originalname.replace('.pdf', '');
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

        const document = new Document({
            title: title.trim(),
            content: content,
            tags: tags
        });

        await document.save();
        res.status(201).json(document);
    } catch (error) {
        console.error('PDF upload error:', error.message);
        if (error.message === 'Only PDF files are allowed') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to process PDF file' });
    }
});

// delete document
router.delete('/:id', async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid document ID' });
        }
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

module.exports = router;
