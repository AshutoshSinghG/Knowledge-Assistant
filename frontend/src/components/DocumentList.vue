<template>
    <div class="document-list">
        <div v-if="loading" class="loading-state">
            <span class="spinner"></span>
            <span>Loading documents...</span>
        </div>

        <div v-else-if="documents.length === 0" class="empty-state">
            <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                </svg>
            </div>
            <h3>No documents yet</h3>
            <p>Add your first document to get started</p>
        </div>

        <div v-else class="documents-grid">
            <div 
                v-for="doc in documents" 
                :key="doc._id" 
                class="document-card fade-in"
            >
                <div class="document-header">
                    <h3 class="document-title">{{ doc.title }}</h3>
                    <button 
                        class="btn-danger" 
                        @click="handleDelete(doc._id)"
                        :disabled="deleting === doc._id"
                    >
                        {{ deleting === doc._id ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>

                <p class="document-content">{{ truncate(doc.content, 200) }}</p>

                <div class="document-footer">
                    <div class="document-tags" v-if="doc.tags && doc.tags.length">
                        <span 
                            v-for="tag in doc.tags" 
                            :key="tag" 
                            class="tag"
                        >
                            {{ tag }}
                        </span>
                    </div>
                    <span class="document-date">{{ formatDate(doc.createdAt) }}</span>
                </div>
            </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script>
import { documentsApi } from '../services/api';

export default {
    name: 'DocumentList',
    emits: ['document-deleted'],
    data() {
        return {
            documents: [],
            loading: true,
            deleting: null,
            error: null
        };
    },
    mounted() {
        this.fetchDocuments();
    },
    methods: {
        async fetchDocuments() {
            this.loading = true;
            this.error = null;

            try {
                const response = await documentsApi.getAll();
                this.documents = response.data;
            } catch (err) {
                this.error = 'Failed to load documents';
            } finally {
                this.loading = false;
            }
        },

        async handleDelete(id) {
            if (!confirm('Are you sure you want to delete this document?')) {
                return;
            }

            this.deleting = id;

            try {
                await documentsApi.delete(id);
                this.documents = this.documents.filter(doc => doc._id !== id);
                this.$emit('document-deleted');
            } catch (err) {
                this.error = 'Failed to delete document';
            } finally {
                this.deleting = null;
            }
        },

        truncate(text, length) {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        },

        refresh() {
            this.fetchDocuments();
        }
    }
};
</script>

<style scoped>
.document-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px;
    color: var(--text-muted);
}

.empty-state {
    text-align: center;
    padding: 48px 24px;
    color: var(--text-muted);
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: var(--primary);
    opacity: 0.5;
}

.empty-icon svg {
    width: 100%;
    height: 100%;
}

.empty-state h3 {
    margin-bottom: 8px;
    color: var(--text-secondary);
}

.documents-grid {
    display: grid;
    gap: 16px;
}

.document-card {
    background: var(--bg-input);
    border-radius: var(--radius-md);
    padding: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    border: 1px solid var(--border);
}

.document-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border-color: var(--primary);
}

.document-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 12px;
}

.document-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
}

.document-content {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 16px;
}

.document-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.document-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.document-date {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.error-message {
    color: var(--error);
    padding: 12px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-sm);
    text-align: center;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 480px) {
    .document-card {
        padding: 16px;
    }

    .document-header {
        flex-direction: column;
        gap: 12px;
    }

    .document-title {
        font-size: 1rem;
    }

    .document-content {
        font-size: 0.9rem;
    }
}
</style>
