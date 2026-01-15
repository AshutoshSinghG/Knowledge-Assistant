const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initializeAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not set. AI features will be disabled.');
        return false;
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    return true;
};

const generateAnswer = async (question, context) => {
    if (!model) {
        const initialized = initializeAI();
        if (!initialized) {
            throw new Error('AI service not configured. Please set GEMINI_API_KEY.');
        }
    }

    const prompt = buildPrompt(question, context);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('AI generation error:', error.message);
        throw new Error('Failed to generate answer. Please try again.');
    }
};

const buildPrompt = (question, context) => {
    if (!context || context.trim() === '') {
        return `You are a helpful assistant. The user asked: "${question}"

Unfortunately, there are no documents in the knowledge base related to this question.
Please let the user know that no relevant information was found and suggest they add relevant documents first.`;
    }

    return `You are a helpful assistant that answers questions based only on the provided context.
If the context doesn't contain relevant information to answer the question, say so clearly.
Keep your answers concise and to the point.

Context:
${context}

Question: ${question}

Answer based on the context above:`;
};

module.exports = {
    initializeAI,
    generateAnswer
};
