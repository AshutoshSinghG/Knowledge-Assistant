# Knowledge Assistant

A full-stack web application for managing documents and getting AI-powered answers using RAG (Retrieval Augmented Generation).

## Tech Stack

- **Frontend**: Vue.js 3 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: Google Gemini API

## Project Structure

```
knowledge-assistant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── models/
│   │   │   └── Document.js    # Document schema
│   │   ├── routes/
│   │   │   ├── documents.js   # CRUD endpoints
│   │   │   └── qa.js          # Q&A endpoint
│   │   ├── services/
│   │   │   ├── ragService.js  # Document retrieval
│   │   │   └── aiService.js   # Gemini integration
│   │   └── app.js             # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentForm.vue
│   │   │   ├── DocumentList.vue
│   │   │   └── QuestionAnswer.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   │   └── main.css
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your values:
   ```
   MONGODB_URI=mongodb://localhost:27017/knowledge-assistant
   GEMINI_API_KEY=your-actual-api-key
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:5173`

## How It Works

### RAG (Retrieval Augmented Generation)

The app uses a simple RAG approach to answer questions based on your documents:

1. **Store**: When you add a document, it gets stored in MongoDB with a text index on title, content, and tags.

2. **Retrieve**: When you ask a question, the backend searches MongoDB using:
   - Full-text search matching keywords from your question
   - Falls back to regex search if no text matches found
   - Returns the top 5 most relevant documents

3. **Generate**: The retrieved documents are combined into a context string and sent to Gemini along with your question. Gemini generates an answer based only on the provided context.

4. **Respond**: The answer is returned along with source citations showing which documents were used.

### AI Prompting

The prompt sent to Gemini follows this structure:

```
You are a helpful assistant that answers questions based only on the provided context.
If the context doesn't contain relevant information to answer the question, say so clearly.
Keep your answers concise and to the point.

Context:
[Document 1: Title]
[Content...]

---

[Document 2: Title]
[Content...]

Question: [User's question]

Answer based on the context above:
```

This approach:
- Grounds the AI in your actual documents
- Prevents hallucination by limiting responses to provided context
- Returns "no relevant info" when documents don't cover the question

## API Endpoints

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | Get all documents |
| GET | `/api/documents/:id` | Get single document |
| POST | `/api/documents` | Create document (text) |
| POST | `/api/documents/upload-pdf` | Upload PDF document |
| DELETE | `/api/documents/:id` | Delete document |

### Q&A

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/qa/ask` | Ask a question |

**Request body for creating document:**
```json
{
  "title": "Document Title",
  "content": "Document content goes here",
  "tags": ["tag1", "tag2"]
}
```

**Request body for asking question:**
```json
{
  "question": "What is...?"
}
```

## Running the Project

1. Make sure MongoDB is running locally or you have an Atlas connection string.

2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

3. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

5. Add some documents about a topic, then switch to the Q&A tab and ask questions about them.

## Notes

- The Gemini API has rate limits. If you hit them, wait a minute and try again.
- For better retrieval results, make sure document content is detailed and includes relevant keywords.
- Tags help with search - use descriptive tags when adding documents.
