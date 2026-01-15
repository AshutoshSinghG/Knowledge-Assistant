<template>
    <div class="qa-section">
        <form class="qa-form" @submit.prevent="handleAsk">
            <div class="question-input-wrapper">
                <input 
                    v-model="question"
                    type="text"
                    class="input-field question-input"
                    placeholder="Ask a question about your documents..."
                    :disabled="loading"
                />
                <button 
                    type="submit" 
                    class="btn-primary ask-btn"
                    :disabled="loading || !question.trim()"
                >
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Ask</span>
                </button>
            </div>
        </form>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="answer" class="answer-section fade-in">
            <div class="answer-box">
                <h3 class="answer-label">
                    <svg class="answer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    Answer
                </h3>
                <div class="answer-content">{{ answer }}</div>
            </div>

            <div v-if="sources.length > 0" class="sources-section">
                <h4 class="sources-label">
                    <svg class="sources-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    Sources Used
                </h4>
                <div class="sources-list">
                    <div 
                        v-for="source in sources" 
                        :key="source.id" 
                        class="source-item"
                    >
                        <span class="source-title">{{ source.title }}</span>
                        <span class="source-snippet">{{ source.snippet }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!answer && !loading && !error" class="help-text">
            <div class="help-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
            </div>
            <p>Ask any question based on the documents you've added.</p>
            <p>The AI will search through your knowledge base and provide relevant answers.</p>
        </div>
    </div>
</template>

<script>
import { qaApi } from '../services/api';

export default {
    name: 'QuestionAnswer',
    data() {
        return {
            question: '',
            answer: null,
            sources: [],
            loading: false,
            error: null
        };
    },
    methods: {
        async handleAsk() {
            if (!this.question.trim()) return;

            this.loading = true;
            this.error = null;
            this.answer = null;
            this.sources = [];

            try {
                const response = await qaApi.ask(this.question);
                this.answer = response.data.answer;
                this.sources = response.data.sources || [];
            } catch (err) {
                this.error = err.response?.data?.error || 'Failed to get answer. Please try again.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.qa-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.qa-form {
    width: 100%;
}

.question-input-wrapper {
    display: flex;
    gap: 12px;
}

.question-input {
    flex: 1;
}

.ask-btn {
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-message {
    color: var(--error);
    padding: 12px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.answer-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.answer-box {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
    border: 1px solid rgba(249, 115, 22, 0.3);
    border-radius: var(--radius-md);
    padding: 20px;
}

.answer-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.answer-icon {
    width: 18px;
    height: 18px;
}

.answer-content {
    color: var(--text-primary);
    line-height: 1.7;
    font-size: 1rem;
    white-space: pre-wrap;
}

.sources-section {
    background: var(--bg-input);
    border-radius: var(--radius-md);
    padding: 16px;
    border: 1px solid var(--border);
}

.sources-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 12px;
}

.sources-icon {
    width: 16px;
    height: 16px;
}

.sources-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.source-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: var(--bg-card);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
}

.source-title {
    font-weight: 500;
    color: var(--primary);
    font-size: 0.95rem;
}

.source-snippet {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.help-text {
    text-align: center;
    padding: 32px;
    color: var(--text-muted);
}

.help-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    color: var(--primary);
    opacity: 0.5;
}

.help-icon svg {
    width: 100%;
    height: 100%;
}

.help-text p {
    margin: 4px 0;
}

@media (max-width: 600px) {
    .question-input-wrapper {
        flex-direction: column;
    }
    
    .ask-btn {
        width: 100%;
    }

    .answer-box {
        padding: 16px;
    }

    .sources-section {
        padding: 14px;
    }
}
</style>
