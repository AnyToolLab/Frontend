<script setup lang="ts">
import { computed, ref } from 'vue';

import addIconSVG from '../assets/images/add-icon.svg'

const action = ref<'compress' | 'extract'>('compress');
const isProcessing = ref(false);

const uploadedMultipleFiles = ref<File[]>([]);
const uploadedSingleFile = ref<File | null>(null);
const compressedFile = ref<{ file_url: string; file_name: string } | null>(null);
const extractedFiles = ref<{ file_url: string; file_name: string; file_size: number }[]>([]);
const extractedArchiveName = ref<string>('');

const MAX_TOTAL_SIZE = 1073741824;
const MAX_FILES_COUNT = 20;
const SERVER_URL = import.meta.env.VITE_SERVER_URL

const extractedFilesCount = computed(() => {
    return extractedFiles.value.length;
});

const extractedFilesSize = computed(() => {
    return extractedFiles.value.reduce((sum, file) => sum + file.file_size, 0);
});

function handleTabChange(tab: 'compress' | 'extract') {
    action.value = tab;
}

function handleMultipleUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    const files = Array.from(target.files);
    let currentTotalSize = uploadedMultipleFiles.value.reduce((sum, file) => sum + file.size, 0);

    for (const file of files) {
        if (
            uploadedMultipleFiles.value.length >= MAX_FILES_COUNT ||
            currentTotalSize + file.size > MAX_TOTAL_SIZE
        ) {
            break;
        }

        uploadedMultipleFiles.value.push(file);
        currentTotalSize += file.size;
    }
}

function handleSingleUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        if (target.files[0].size > 104857600) {
            return;
        }
        uploadedSingleFile.value = target.files[0];
        extactArchive();
    }
}

function openFileDialog() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    if (action.value === 'compress') {
        fileInput.multiple = true;
        fileInput.addEventListener('change', handleMultipleUpload);
    } else {
        fileInput.accept = '.zip';
        fileInput.addEventListener('change', handleSingleUpload);
    }
    fileInput.click();
}

const formattedTotalMultipleFilesSize = computed(() => {
    const totalSize = uploadedMultipleFiles.value.reduce((sum, file) => sum + file.size, 0);

    if (totalSize < 1024) {
        return `${totalSize} bytes`;
    } else if (totalSize < 1048576) {
        return `${(totalSize / 1024).toFixed(2)}KB`;
    } else if (totalSize < 1073741824) {
        return `${(totalSize / 1048576).toFixed(2)}MB`;
    } else {
        return `${(totalSize / 1073741824).toFixed(2)}GB`;
    }
});

const multipleFilesCount = computed(() => uploadedMultipleFiles.value.length);

function handleDeleteFile(index: number) {
    if (action.value === 'compress') {
        uploadedMultipleFiles.value.splice(index, 1);
    } else {
        uploadedSingleFile.value = null;
    }
}

function reset() {
    if (action.value === 'compress') {
        uploadedMultipleFiles.value = [];
        compressedFile.value = null;
    } else {
        uploadedSingleFile.value = null;
        extractedFiles.value = [];
        extractedArchiveName.value = '';

    }
}

const createArchive = async () => {
    isProcessing.value = true;

    const formData = new FormData();

    uploadedMultipleFiles.value.forEach(file => {
        if (file) {
            formData.append('files', file);
        }
    });

    try {
        const response = await fetch(`${SERVER_URL}/zip/create/`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success') {
                compressedFile.value = result.data
            }
        } else {
            throw new Error('Failed to create archive');
        }
    } catch (error) {
        console.error(error);
    } finally {
        uploadedMultipleFiles.value = [];
        isProcessing.value = false;
    }
};

const extactArchive = async () => {
    isProcessing.value = true;

    const formData = new FormData();

    if (uploadedSingleFile.value) {
        formData.append('file', uploadedSingleFile.value);
    }
    try {
        const response = await fetch(`${SERVER_URL}/zip/extract/`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success') {
                extractedFiles.value = result.data.files;
                extractedArchiveName.value = result.data.file_name;
            }
        } else {
            throw new Error('Failed to extract archive');
        }
    } catch (error) {
        console.error(error);
    } finally {
        uploadedSingleFile.value = null;
        isProcessing.value = false;
    }
};

const formattedFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} bytes`;
    } else if (size < 1048576) {
        return `${(size / 1024).toFixed(2)}KB`;
    } else if (size < 1073741824) {
        return `${(size / 1048576).toFixed(2)}MB`;
    } else {
        return `${(size / 1073741824).toFixed(2)}GB`;
    }
};

</script>

<template>
    <main class="main">
        <div class="container">
            <div class="main__content">
                <h1 class="main__title">
                    Archiver
                </h1>
                <div class="main__tool">
                    <div class="tool__action">
                        <div class="archiver">
                            <div class="archiver__tabs">
                                <div :class="['archiver_tab', { active: action === 'compress' }]"
                                    @click="handleTabChange('compress')">
                                    Compress Files
                                </div>
                                <div :class="['archiver_tab', { active: action === 'extract' }]"
                                    @click="handleTabChange('extract')">
                                    Extract Files
                                </div>
                            </div>
                            <div class="archiver__main">
                                <div v-if="isProcessing" class="loader">Processing ...</div>
                                <div v-else-if="action === 'compress'" class="archiver__compress">
                                    <div v-if="compressedFile" class="tool__preview">
                                        <h3 class="preview__title">Files Compressed!</h3>
                                        <p class="preview__text">You can save your archive file now.</p>
                                        <div class="archiver__button save">
                                            <a :href="`${SERVER_URL}${compressedFile.file_url}`" target="_blank"
                                                :download="compressedFile.file_name">
                                                <button class="button save">
                                                    Save file
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="24"
                                                        fill="none" viewBox="0 0 19 24">
                                                        <path fill="#FEFDF9"
                                                            d="M16.72 2.048H2.28c-.598 0-1.082-.459-1.082-1.024C1.198.458 1.682 0 2.28 0h14.44c.598 0 1.082.458 1.082 1.024 0 .565-.484 1.024-1.082 1.024M17.918 14.003c.288 0 .564.11.765.305a.985.985 0 0 1 0 1.447L10.265 23.7c-.423.399-1.107.399-1.53 0L.317 15.755a.985.985 0 0 1 0-1.447 1.1 1.1 0 0 1 .765-.306c.288 0 .564.11.765.306l6.57 6.198V5.188c0-.566.485-1.024 1.083-1.024s1.083.458 1.083 1.024v15.318l6.57-6.198a1.1 1.1 0 0 1 .765-.306" />
                                                    </svg>
                                                </button>
                                            </a>
                                            <button class="reset" @click="reset">reset</button>
                                        </div>
                                    </div>
                                    <div v-else-if="uploadedMultipleFiles.length === 0" class="tool__preview">
                                        <p class="preview__desc">Select files you want to archive</p>
                                        <div class="archiver__button">
                                            <button class="button" @click="openFileDialog">Select files</button>
                                            <div @click="openFileDialog" class="archiver__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="47"
                                                    fill="none" viewBox="0 0 54 47">
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M17.638 2.186a.75.75 0 0 1 .766-.01L49.88 20.354a.75.75 0 0 1 0 1.298l-14.991 8.68a.75.75 0 0 1-.759-.005L3.492 12.121a.75.75 0 0 1-.008-1.285l14.154-8.65-.652-1.066z" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M3.909 21.618a.75.75 0 0 1-.007-1.275L33.633 1.705a.75.75 0 0 1 .78-.01l15.52 9.153a.75.75 0 0 1-.001 1.293L18.9 30.317a.75.75 0 0 1-.77-.008z" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M9 25.5v9.928a1 1 0 0 0 .493.862l15.777 9.28a.5.5 0 0 0 .753-.417L26.5 27.5" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="m26.5 26.5-.477 18.613a.5.5 0 0 0 .748.447l16.225-9.272a1 1 0 0 0 .504-.868V26.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="archiver__action">
                                        <div>
                                            <div class="files__info">
                                                <p><span class="bold">Total files:</span>
                                                    {{ formattedTotalMultipleFilesSize }}/1GB,
                                                    {{ multipleFilesCount }}/{{ MAX_FILES_COUNT }} files
                                                </p>
                                            </div>
                                            <div class="files">
                                                <div class="files__header">
                                                    <div class="files__icons">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            fill="none" viewBox="0 0 24 24">
                                                            <path stroke="#fff" stroke-linecap="round"
                                                                stroke-linejoin="round" stroke-width="2"
                                                                d="M2 19.658h2m0 0h6m-6 0V11.29c0-.523 0-.784.065-1.028.058-.216.153-.42.28-.604.145-.208.346-.381.748-.726l4.801-4.113c.746-.639 1.119-.958 1.538-1.08.37-.107.765-.107 1.135 0 .42.122.794.442 1.54 1.081l4.8 4.112c.402.345.603.518.748.726.127.184.222.388.28.604.065.244.065.505.065 1.028v8.37m-10 0h4m-4 0v-3.917c0-1.081.895-1.958 2-1.958s2 .877 2 1.958v3.916m0 0h6m0 0h2" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="19"
                                                            fill="none" viewBox="0 0 10 20">
                                                            <path fill="#FEFDF9" d="M.69 19 7.29.16h2.24L2.93 19z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="files__list">
                                                    <div v-for="(file, index) in uploadedMultipleFiles" :key="index"
                                                        class="file__item">
                                                        <div class="file__inner file">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" fill="none">
                                                                <path stroke="#000" stroke-linecap="round"
                                                                    stroke-linejoin="round" stroke-width="2"
                                                                    d="M15 2.4V6a1.2 1.2 0 0 0 1.2 1.2h3.6m-1.8-3a27 27 0 0 1-1.438-1.412 1.23 1.23 0 0 0-.893-.388H6.6a2.4 2.4 0 0 0-2.4 2.4v14.4a2.4 2.4 0 0 0 2.4 2.4h10.8a2.4 2.4 0 0 0 2.4-2.4L19.8 6.478c0-.307-.117-.602-.33-.822C19.076 5.247 18.42 4.575 18 4.2" />
                                                            </svg>
                                                            <p class="file__text">{{ file.name }}</p>
                                                        </div>
                                                        <div class="file__inner">
                                                            <p class="file__text">
                                                                {{
                                                                    file.size < 1024 ? `${file.size} bytes` : file.size <
                                                                        1048576 ? `${(file.size / 1024).toFixed(2)} KB` :
                                                                        `${(file.size / 1048576).toFixed(2)} MB` }} </p>
                                                                    <button class="file__del"
                                                                        @click="handleDeleteFile(index)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="20" height="22" fill="none">
                                                                            <path fill="#2A343D"
                                                                                d="M4.162 3.746a.8.8 0 0 0-.6.254.984.984 0 0 0 0 1.296l5.235 5.665-5.234 5.665a.984.984 0 0 0 0 1.297.81.81 0 0 0 1.198 0l5.234-5.665 5.235 5.665a.81.81 0 0 0 1.198 0 .984.984 0 0 0 0-1.297l-5.235-5.665 5.235-5.665a.984.984 0 0 0 0-1.296.8.8 0 0 0-.6-.254.8.8 0 0 0-.598.254L9.995 9.664 4.761 4a.8.8 0 0 0-.6-.254" />
                                                                        </svg>
                                                                    </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="archiver__buttons">
                                            <button class="button add-img" @click="openFileDialog">
                                                <img :src="addIconSVG" alt="Add icon">
                                                Add file
                                            </button>
                                            <div class="buttons-group">
                                                <button class="reset" @click="reset">reset</button>
                                                <button class="button" @click="createArchive">Compress</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="archiver__extract">
                                    <div v-if="extractedFiles.length !== 0" class="archiver__action">
                                        <div>
                                            <div class="action__header">
                                                <div class="files__info">
                                                    <p class="bold">{{ extractedArchiveName }}</p>
                                                    <p>{{ extractedFilesCount }} Files, {{
                                                        formattedFileSize(extractedFilesSize) }}</p>
                                                </div>
                                                <div class="action__buttons">
                                                    <button class="reset" @click="reset">reset</button>
                                                </div>
                                            </div>
                                            <div class="files">
                                                <div class="files__header">
                                                    <div class="files__icons">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            fill="none">
                                                            <path stroke="#fff" stroke-linecap="round"
                                                                stroke-linejoin="round" stroke-width="2"
                                                                d="M2 19.658h2m0 0h6m-6 0V11.29c0-.523 0-.784.065-1.028.058-.216.153-.42.28-.604.145-.208.346-.381.748-.726l4.801-4.113c.746-.639 1.119-.958 1.538-1.08.37-.107.765-.107 1.135 0 .42.122.794.442 1.54 1.081l4.8 4.112c.402.345.603.518.748.726.127.184.222.388.28.604.065.244.065.505.065 1.028v8.37m-10 0h4m-4 0v-3.917c0-1.081.895-1.958 2-1.958s2 .877 2 1.958v3.916m0 0h6m0 0h2" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="19"
                                                            fill="none">
                                                            <path fill="#FEFDF9" d="M.69 19 7.29.16h2.24L2.93 19z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="files__list">
                                                    <div v-for="file in extractedFiles" class="file__item">
                                                        <div class="file__inner">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" fill="none">
                                                                <path stroke="#000" stroke-linecap="round"
                                                                    stroke-linejoin="round" stroke-width="2"
                                                                    d="M15 2.4V6a1.2 1.2 0 0 0 1.2 1.2h3.6m-1.8-3a27 27 0 0 1-1.438-1.412 1.23 1.23 0 0 0-.893-.388H6.6a2.4 2.4 0 0 0-2.4 2.4v14.4a2.4 2.4 0 0 0 2.4 2.4h10.8a2.4 2.4 0 0 0 2.4-2.4L19.8 6.478c0-.307-.117-.602-.33-.822C19.076 5.247 18.42 4.575 18 4.2" />
                                                            </svg>
                                                            <p class="file__text">{{ file.file_name }}</p>
                                                        </div>
                                                        <div class="file__inner">
                                                            <p class="file__text">{{ formattedFileSize(file.file_size)
                                                                }}
                                                            </p>
                                                            <a :href="`${SERVER_URL}${file.file_url}`"
                                                                :download="file.file_name" target="_blank">
                                                                <button class="file__save">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19"
                                                                        height="24" fill="none" viewBox="0 0 19 24">
                                                                        <path fill="#FEFDF9"
                                                                            d="M16.72 2.048H2.28c-.598 0-1.082-.459-1.082-1.024C1.198.458 1.682 0 2.28 0h14.44c.598 0 1.082.458 1.082 1.024 0 .565-.484 1.024-1.082 1.024M17.918 14.003c.288 0 .564.11.765.305a.985.985 0 0 1 0 1.447L10.265 23.7c-.423.399-1.107.399-1.53 0L.317 15.755a.985.985 0 0 1 0-1.447 1.1 1.1 0 0 1 .765-.306c.288 0 .564.11.765.306l6.57 6.198V5.188c0-.566.485-1.024 1.083-1.024s1.083.458 1.083 1.024v15.318l6.57-6.198a1.1 1.1 0 0 1 .765-.306" />
                                                                    </svg>
                                                                </button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="tool__preview">
                                        <p class="preview__desc">Select the file you want to unzip</p>
                                        <p class="preview__text">*only files up to <span class="bold">100MB</span> are
                                            allowed</p>
                                        <div class="archiver__button">
                                            <button class="button" @click="openFileDialog">Select file</button>
                                            <div class="archiver__icon" @click="openFileDialog">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="47"
                                                    fill="none" viewBox="0 0 54 47">
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M17.638 2.186a.75.75 0 0 1 .766-.01L49.88 20.354a.75.75 0 0 1 0 1.298l-14.991 8.68a.75.75 0 0 1-.759-.005L3.492 12.121a.75.75 0 0 1-.008-1.285l14.154-8.65-.652-1.066z" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M3.909 21.618a.75.75 0 0 1-.007-1.275L33.633 1.705a.75.75 0 0 1 .78-.01l15.52 9.153a.75.75 0 0 1-.001 1.293L18.9 30.317a.75.75 0 0 1-.77-.008z" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="M9 25.5v9.928a1 1 0 0 0 .493.862l15.777 9.28a.5.5 0 0 0 .753-.417L26.5 27.5" />
                                                    <path stroke="#FEFDF9" stroke-width="2.5"
                                                        d="m26.5 26.5-.477 18.613a.5.5 0 0 0 .748.447l16.225-9.272a1 1 0 0 0 .504-.868V26.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
p {
    margin: 0;
}

.bold {
    font-weight: 600;
}

.main {
    margin-top: 54px;
    margin-bottom: 104px;
    color: #202020;
    font-family: Montserrat;
}

.main__content {
    display: flex;
    flex-direction: column;
}

.button {
    display: flex;
    gap: 24px;
    padding: 15px 25px;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 50px;
    background-color: #01257D;
    font-size: 22px;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #00AEFF;
}

.main__title {
    font-size: 36px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 40px;
}

.tool__desc {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 48px;
}

.tool__preview {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 500px;
}

.tool__action {
    display: grid;
    min-height: 500px;
}

.archiver__tabs {
    display: flex;
    font-weight: 500;
    font-size: 20px;
    gap: 2px;
    align-items: flex-end;
}

.archiver_tab {
    padding: 5px 50px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: 1px solid #01257D;
    cursor: pointer;
}

.archiver_tab.active {
    font-size: 22px;
    padding: 10px 30px;
}

.archiver__main {
    display: flex;
    padding: 24px;
    border: 1px solid #01257D;
    border-radius: 10px;
    border-top-left-radius: 0px;
    min-height: 500px;
}

.preview__desc,
.preview__title,
.preview__text {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
}

.preview__text {
    font-size: 14px;
}

.preview__title {
    font-weight: 500;
    margin-bottom: 10px;
}

.archiver__button {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 15px;
}

.archiver__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10.5px;
    border-radius: 50px;
    background-color: #01257D;
    cursor: pointer;
    transition: background-color 0.3s;
}

.archiver__icon svg {
    max-width: 40px;
    height: auto;
}

.archiver__icon:hover {
    background-color: #00AEFF;
}

.files__info {
    font-size: 20px;
}

.archiver__compress,
.archiver__extract {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.archiver__action {
    width: 100%;
}

.files {
    margin-top: 15px;
    margin-bottom: 25px;
}

.files__header {
    background-color: #01257D;
    padding: 4px 13px 2px 13px;
    border-radius: 5px;
}

.files__icons {
    display: flex;
    align-items: center;
    gap: 3px;
}

.files__list {
    border-radius: 5px;
    background-color: #01257d17;
    font-size: 20px;
    font-weight: 400;
}

.file__item,
.file__inner {
    display: flex;
}

.file__item {
    justify-content: space-between;
    align-items: center;
    padding: 4px 13px;
}

.file__inner {
    display: flex;
    align-items: center;
    gap: 16px;
}

.file__inner.file {
    gap: 12px;
}

.file__del {
    display: flex;
    align-items: center;
    justify-content: center;
}

.archiver__action {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.archiver__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.buttons-group {
    display: flex;
    align-items: center;
    gap: 35px;
}

.reset {
    font-size: 22px;
    color: #01257D;
}

.button.save svg {
    max-width: 15px;
    height: auto;
}

.button.save {
    gap: 15px
}

.archiver__button.save {
    display: flex;
    gap: 25px;
    margin-top: 25px;
    align-items: center;
}

.loader {
    font-size: 22px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.action__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file__save {
    display: flex;
    align-items: center;
    background-color: #01257D;
    padding: 7px 25px;
    border-radius: 15px;
    transition: background-color 0.3s;
}

.file__save svg {
    max-width: 13px;
    height: auto;
}

.file__save:hover {
    background-color: #00AEFF;
}
</style>