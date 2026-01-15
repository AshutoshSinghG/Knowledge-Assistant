<template>
    <div class="app">
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <div class="logo-section">
                        <img src="./assets/ai-icon.png" alt="AI" class="logo-icon" />
                        <div class="logo-text">
                            <h1 class="logo">Knowledge Assistant</h1>
                            <p class="tagline">AI-powered document Q&A</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-text">
                        <h2 class="hero-title">Your Personal <span class="highlight">Knowledge Base</span></h2>
                        <p class="hero-description">
                            Store documents, ask questions, and get intelligent answers powered by AI.
                            Build your knowledge repository and let AI help you find answers instantly.
                        </p>
                    </div>
                    <div class="hero-image">
                        <img src="./assets/hero.png" alt="Knowledge AI" />
                    </div>
                </div>
            </div>
        </section>

        <main class="main">
            <div class="container">
                <nav class="tabs">
                    <button 
                        :class="['tab', { active: activeTab === 'documents' }]"
                        @click="activeTab = 'documents'"
                    >
                        <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        Documents
                    </button>
                    <button 
                        :class="['tab', { active: activeTab === 'qa' }]"
                        @click="activeTab = 'qa'"
                    >
                        <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Ask Question
                    </button>
                </nav>

                <div class="content">
                    <div v-show="activeTab === 'documents'" class="documents-view">
                        <section class="card add-document-section">
                            <h2 class="section-title">
                                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="16"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                </svg>
                                Add Document
                            </h2>
                            <DocumentForm @document-added="handleDocumentAdded" />
                        </section>

                        <section class="documents-section">
                            <h2 class="section-title">
                                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                                </svg>
                                Your Documents
                            </h2>
                            <div class="card">
                                <DocumentList ref="documentList" />
                            </div>
                        </section>
                    </div>

                    <div v-show="activeTab === 'qa'" class="qa-view">
                        <section class="card">
                            <h2 class="section-title">
                                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                Ask a Question
                            </h2>
                            <QuestionAnswer />
                        </section>
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="container">
                <p>Ashutosh</p>
            </div>
        </footer>
    </div>
</template>

<script>
import DocumentForm from './components/DocumentForm.vue';
import DocumentList from './components/DocumentList.vue';
import QuestionAnswer from './components/QuestionAnswer.vue';

export default {
    name: 'App',
    components: {
        DocumentForm,
        DocumentList,
        QuestionAnswer
    },
    data() {
        return {
            activeTab: 'documents'
        };
    },
    methods: {
        handleDocumentAdded() {
            this.$refs.documentList.refresh();
        }
    }
};
</script>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    justify-content: center;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.logo-text {
    text-align: left;
}

.logo {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 2px;
}

.tagline {
    color: var(--text-muted);
    font-size: 0.85rem;
}

.hero {
    padding: 48px 0;
    background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-dark) 100%);
    border-bottom: 1px solid var(--border);
}

.hero-content {
    display: flex;
    align-items: center;
    gap: 48px;
}

.hero-text {
    flex: 1;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    color: var(--text-primary);
}

.highlight {
    color: var(--primary);
}

.hero-description {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 500px;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
}

.hero-image img {
    max-width: 100%;
    height: auto;
    max-height: 300px;
    border-radius: var(--radius-lg);
}

.main {
    flex: 1;
    padding: 32px 0;
}

.tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    background: var(--bg-card);
    padding: 6px;
    border-radius: var(--radius-md);
    width: fit-content;
    border: 1px solid var(--border);
}

.tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: var(--radius-sm);
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    transition: all 0.2s ease;
}

.tab-icon {
    width: 18px;
    height: 18px;
}

.tab:hover {
    color: var(--text-primary);
    background: var(--bg-input);
}

.tab.active {
    background: var(--primary);
    color: white;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text-primary);
}

.section-icon {
    width: 22px;
    height: 22px;
    color: var(--primary);
}

.documents-view {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.add-document-section {
    max-width: 600px;
}

.documents-section .section-title {
    margin-bottom: 16px;
}

.qa-view .card {
    max-width: 800px;
}

.footer {
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    padding: 20px 0;
    margin-top: auto;
}

.footer p {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
}

@media (max-width: 900px) {
    .hero-content {
        flex-direction: column-reverse;
        text-align: center;
        gap: 32px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-description {
        margin: 0 auto;
    }

    .hero-image img {
        max-height: 220px;
    }
}

@media (max-width: 768px) {
    .header {
        padding: 12px 0;
    }

    .logo-icon {
        width: 40px;
        height: 40px;
    }

    .logo {
        font-size: 1.3rem;
    }

    .hero {
        padding: 32px 0;
    }

    .hero-title {
        font-size: 1.6rem;
    }

    .hero-description {
        font-size: 1rem;
    }

    .main {
        padding: 20px 0;
    }

    .tabs {
        width: 100%;
    }

    .tab {
        flex: 1;
        justify-content: center;
        padding: 12px 16px;
    }
}

@media (max-width: 480px) {
    .logo-section {
        gap: 10px;
    }

    .logo {
        font-size: 1.1rem;
    }

    .tagline {
        font-size: 0.75rem;
    }

    .hero-title {
        font-size: 1.4rem;
    }

    .hero-image img {
        max-height: 180px;
    }

    .tab {
        padding: 10px 12px;
        font-size: 0.9rem;
    }

    .tab-icon {
        width: 16px;
        height: 16px;
    }

    .section-title {
        font-size: 1rem;
    }
}
</style>
