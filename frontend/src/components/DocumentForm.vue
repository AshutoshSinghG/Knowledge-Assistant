<template>
    <div class="document-form-container">
        <div class="input-mode-tabs">
            <button 
                :class="['mode-tab', { active: inputMode === 'text' }]"
                @click="inputMode = 'text'"
            >
                <svg class="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Text Input
            </button>
            <button 
                :class="['mode-tab', { active: inputMode === 'pdf' }]"
                @click="inputMode = 'pdf'"
            >
                <svg class="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                </svg>
                Upload PDF
            </button>
        </div>

        <form v-if="inputMode === 'text'" class="document-form" @submit.prevent="handleTextSubmit">
            <div class="form-group">
                <label for="title">Title</label>
                <input 
                    id="title"
                    v-model="textForm.title"
                    type="text"
                    class="input-field"
                    placeholder="Enter document title"
                    required
                />
            </div>

            <div class="form-group">
                <label for="content">Content</label>
                <textarea 
                    id="content"
                    v-model="textForm.content"
                    class="input-field"
                    placeholder="Enter document content"
                    rows="6"
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label for="tags">Tags (comma separated)</label>
                <input 
                    id="tags"
                    v-model="textForm.tagsInput"
                    type="text"
                    class="input-field"
                    placeholder="e.g. javascript, tutorial, guide"
                />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Add Document</span>
                </button>
            </div>
        </form>

        <form v-else class="document-form" @submit.prevent="handlePdfSubmit">
            <div class="form-group">
                <label for="pdf-title">Title (optional)</label>
                <input 
                    id="pdf-title"
                    v-model="pdfForm.title"
                    type="text"
                    class="input-field"
                    placeholder="Leave empty to use filename"
                />
            </div>

            <div class="form-group">
                <label>PDF File</label>
                <div 
                    class="file-drop-zone"
                    :class="{ 'has-file': pdfForm.file, 'drag-over': isDragging }"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="handleDrop"
                    @click="triggerFileInput"
                >
                    <input 
                        ref="fileInput"
                        type="file"
                        accept=".pdf"
                        @change="handleFileSelect"
                        hidden
                    />
                    <div v-if="pdfForm.file" class="file-info">
                        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                        <span class="file-name">{{ pdfForm.file.name }}</span>
                        <button type="button" class="remove-file" @click.stop="removeFile">×</button>
                    </div>
                    <div v-else class="drop-prompt">
                        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17,8 12,3 7,8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Drop PDF here or click to browse</span>
                        <span class="file-hint">Maximum file size: 10MB</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="pdf-tags">Tags (comma separated)</label>
                <input 
                    id="pdf-tags"
                    v-model="pdfForm.tagsInput"
                    type="text"
                    class="input-field"
                    placeholder="e.g. research, paper, notes"
                />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary" :disabled="loading || !pdfForm.file">
                    <span v-if="loading" class="spinner"></span>
                    <span v-else>Upload PDF</span>
                </button>
            </div>
        </form>

        <div v-if="error" class="form-error">{{ error }}</div>
        <div v-if="success" class="form-success">{{ successMessage }}</div>
    </div>
</template>

<script>
import { documentsApi } from '../services/api';

export default {
    name: 'DocumentForm',
    emits: ['document-added'],
    data() {
        return {
            inputMode: 'text',
            textForm: {
                title: '',
                content: '',
                tagsInput: ''
            },
            pdfForm: {
                title: '',
                file: null,
                tagsInput: ''
            },
            isDragging: false,
            loading: false,
            error: null,
            success: false,
            successMessage: ''
        };
    },
    methods: {
        async handleTextSubmit() {
            this.error = null;
            this.success = false;
            this.loading = true;

            try {
                const tags = this.textForm.tagsInput
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);

                await documentsApi.create({
                    title: this.textForm.title,
                    content: this.textForm.content,
                    tags
                });

                this.successMessage = 'Document added successfully!';
                this.success = true;
                this.textForm = { title: '', content: '', tagsInput: '' };
                this.$emit('document-added');

                this.clearSuccessAfterDelay();
            } catch (err) {
                this.error = err.response?.data?.error || 'Failed to add document';
            } finally {
                this.loading = false;
            }
        },

        async handlePdfSubmit() {
            if (!this.pdfForm.file) return;

            this.error = null;
            this.success = false;
            this.loading = true;

            try {
                const formData = new FormData();
                formData.append('pdf', this.pdfForm.file);
                
                if (this.pdfForm.title) {
                    formData.append('title', this.pdfForm.title);
                }

                const tags = this.pdfForm.tagsInput
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0);
                
                if (tags.length > 0) {
                    formData.append('tags', JSON.stringify(tags));
                }

                await documentsApi.uploadPdf(formData);

                this.successMessage = 'PDF uploaded and processed successfully!';
                this.success = true;
                this.pdfForm = { title: '', file: null, tagsInput: '' };
                this.$emit('document-added');

                this.clearSuccessAfterDelay();
            } catch (err) {
                this.error = err.response?.data?.error || 'Failed to upload PDF';
            } finally {
                this.loading = false;
            }
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                this.validateAndSetFile(file);
            }
        },

        handleDrop(event) {
            this.isDragging = false;
            const file = event.dataTransfer.files[0];
            if (file) {
                this.validateAndSetFile(file);
            }
        },

        validateAndSetFile(file) {
            if (file.type !== 'application/pdf') {
                this.error = 'Only PDF files are allowed';
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                this.error = 'File size must be less than 10MB';
                return;
            }
            this.error = null;
            this.pdfForm.file = file;
        },

        removeFile() {
            this.pdfForm.file = null;
            this.$refs.fileInput.value = '';
        },

        clearSuccessAfterDelay() {
            setTimeout(() => {
                this.success = false;
            }, 3000);
        }
    }
};
</script>

<style scoped>
.document-form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-mode-tabs {
    display: flex;
    gap: 8px;
    background: var(--bg-input);
    padding: 4px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
}

.mode-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: var(--radius-sm);
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-secondary);
    background: transparent;
    transition: all 0.2s ease;
}

.mode-icon {
    width: 18px;
    height: 18px;
}

.mode-tab:hover {
    color: var(--text-primary);
}

.mode-tab.active {
    background: var(--primary);
    color: white;
}

.document-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.file-drop-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius-md);
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--bg-input);
}

.file-drop-zone:hover {
    border-color: var(--primary);
}

.file-drop-zone.drag-over {
    border-color: var(--primary);
    background: rgba(249, 115, 22, 0.05);
}

.file-drop-zone.has-file {
    border-style: solid;
    border-color: var(--primary);
}

.drop-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
}

.upload-icon {
    width: 40px;
    height: 40px;
    color: var(--primary);
    margin-bottom: 8px;
}

.file-hint {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-primary);
}

.file-icon {
    width: 24px;
    height: 24px;
    color: var(--primary);
}

.file-name {
    font-weight: 500;
}

.remove-file {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--error);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    line-height: 1;
}

.remove-file:hover {
    background: #dc2626;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
}

.form-error {
    color: var(--error);
    font-size: 0.9rem;
    padding: 12px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.form-success {
    color: var(--success);
    font-size: 0.9rem;
    padding: 12px;
    background: rgba(34, 197, 94, 0.1);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(34, 197, 94, 0.3);
}

@media (max-width: 480px) {
    .document-form {
        gap: 16px;
    }

    .mode-tab {
        padding: 8px 12px;
        font-size: 0.85rem;
    }

    .mode-icon {
        width: 16px;
        height: 16px;
    }

    .file-drop-zone {
        padding: 24px 16px;
    }

    .form-actions {
        justify-content: stretch;
    }

    .form-actions .btn-primary {
        width: 100%;
    }
}
</style>
