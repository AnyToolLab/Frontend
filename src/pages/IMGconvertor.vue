<script setup lang="ts">
import { ref } from 'vue';
import uploadFileSVG from '../assets/images/upload-file.svg'
import imgIconSVG from '../assets/images/img-icon.svg'
import dropdownIconSVG from '../assets/images/dropdown-icon.svg'
import deleteIconSVG from '../assets/images/delete-icon.svg'
import addIconSVG from '../assets/images/add-icon.svg'

const uploadedFiles = ref<Array<{ file: File; convert_to: string }>>([]);
const processedFiles = ref<Array<{ file_url: string, file_name: string }>>([]);
const isProcessing = ref(false);

function handleUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        for (const file of Array.from(target.files)) {
            uploadedFiles.value.push({
                file: file,
                convert_to: ''
            });
        }
    }
}

function handleDeleteFile(index: number) {
    uploadedFiles.value.splice(index, 1);
}

function handleConvertTo(index: number, format: string) {
    uploadedFiles.value[index].convert_to = format;
}

const handleProcess = async () => {
    isProcessing.value = true;

    const formData = new FormData();
    const convertToFormats: any = [];

    uploadedFiles.value.forEach(item => {
        if (item.file && item.convert_to) {
            formData.append('images', item.file);
            convertToFormats.push(item.convert_to);
        }
    });

    if (convertToFormats.length !== uploadedFiles.value.length) {
        isProcessing.value = false;
        return;
    }

    formData.append('convert_to_formats', JSON.stringify(convertToFormats));

    try {
        const response = await fetch('http://159.223.218.22:8000/image-converter/convert/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success') {
                processedFiles.value = result.data.converted_image_urls.map((url: string, index: number) => ({
                    file_url: url,
                    file_name: result.data.converted_image_names[index]
                }));
            }
        } else {
            throw new Error('Failed to convert images');
        }
    } catch (error) {
        console.error(error);
    } finally {
        uploadedFiles.value = [];
        isProcessing.value = false;
    }
};

function handleMoreConvert() {
    processedFiles.value = [];
    uploadedFiles.value = [];
}

function openFileDialog() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', handleUpload);
    fileInput.click();
}

</script>

<template>
    <main class="main">
        <div class="container">
            <div class="main__content">
                <h1 class="main__title">
                    Image converter
                </h1>
                <div v-if="isProcessing" class="loader">Processing ...</div>
                <div v-else class="main__tool">
                    <div v-if="uploadedFiles.length === 0 && processedFiles.length === 0" class="tool__preview">
                        <h2 class="tool__desc">
                            Сonvert your image here
                        </h2>
                        <button class="button" @click="openFileDialog">
                            Choose a file(s)
                            <img :src="uploadFileSVG" alt="Upload file icon" class="tools__item-img">
                        </button>
                    </div>
                    <div v-else class="tool__action">
                        <div v-if="processedFiles.length > 0" class="img-converter">
                            <div class="img-list">
                                <div v-for="(item, index) in processedFiles" :key="index" class="img__item">
                                    <div class="img__file">
                                        <img :src="imgIconSVG" alt="Uploaded image" class="img__item-icon">
                                        <div class="img__item-name">{{ item.file_name }}</div>
                                    </div>
                                    <a :href="item.file_url" :download="item.file_name">
                                        <button class="button">
                                            Download
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div class="img-convertor-panel processed">
                                <button class="button convert" @click="handleMoreConvert">
                                    Convert more img
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                        <path fill="#000"
                                            d="m20.05 11.47-7-7A.753.753 0 0 0 12 5.55l5.71 5.7H4.48a.75.75 0 0 0 0 1.5H17.7l-5.7 5.7a.74.74 0 0 0 0 1.06.7.7 0 0 0 .53.22.74.74 0 0 0 .53-.22l7-7a.75.75 0 0 0 0-1.06z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-else class="img-converter">
                            <div class="img-list">
                                <div v-for="(item, index) in uploadedFiles" :key="index" class="img__item">
                                    <div class="img__file">
                                        <img :src="imgIconSVG" alt="Uploaded image" class="img__item-icon">
                                        <div class="img__item-name">{{ item.file.name }}</div>
                                    </div>
                                    <div class="img-list__inner">
                                        <div class="img__dropdown">
                                            <span>to</span>
                                            <div class="dropdown__button">
                                                <div class="converto-to">{{ item.convert_to || '...' }}</div>
                                                <div class="dropdown__icon">
                                                    <img :src="dropdownIconSVG" alt="Dropdown icon">
                                                </div>
                                            </div>
                                            <div class="dropdown__options">
                                                <button @click="handleConvertTo(index, 'PNG')">PNG</button>
                                                <button @click="handleConvertTo(index, 'JPEG')">JPEG</button>
                                                <button @click="handleConvertTo(index, 'WEBP')">WEBP</button>
                                                <button @click="handleConvertTo(index, 'GIF')">GIF</button>
                                                <button @click="handleConvertTo(index, 'PSD')">PSD</button>
                                                <button @click="handleConvertTo(index, 'ICO')">ICO</button>
                                                <button @click="handleConvertTo(index, 'BMP')">BMP</button>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="img-size-info">
                                                {{
                                                    item.file.size < 1024 ? `${item.file.size} bytes` : item.file.size <
                                                        1048576 ? `${(item.file.size / 1024).toFixed(2)} KB` :
                                                        `${(item.file.size / 1048576).toFixed(2)} MB` }} </p>
                                        </div>
                                    </div>
                                    <span class="img__item-del" @click="handleDeleteFile(index)">
                                        <img :src="deleteIconSVG" alt="Delete icon">
                                    </span>
                                </div>
                            </div>
                            <div class="img-convertor-panel">
                                <button class="button add-img" @click="openFileDialog">
                                    <img :src="addIconSVG" alt="Add icon">
                                    Add img
                                </button>
                                <button class="button convert" @click="handleProcess">
                                    Convert
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                        <path fill="#000"
                                            d="m20.05 11.47-7-7A.753.753 0 0 0 12 5.55l5.71 5.7H4.48a.75.75 0 0 0 0 1.5H17.7l-5.7 5.7a.74.74 0 0 0 0 1.06.7.7 0 0 0 .53.22.74.74 0 0 0 .53-.22l7-7a.75.75 0 0 0 0-1.06z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.main {
    margin-top: 82px;
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
    padding: 24px 32px;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 53px;
    background-color: #01257D;
    font-size: 24px;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #00AEFF;
}

.main__title {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 54px;
}

.tool__desc {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 48px;
}

.tool__preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 500px;
}

.tool__action {
    display: grid;
    min-height: 500px;
}

.img-converter {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #F3F5FA;
    border-radius: 20px;
    height: 100%;
}

.img__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 5px 24px;
    border: 1px solid #01257D;
    border-radius: 20px;
    font-size: 24px;
    font-weight: 400;
}

.img__file {
    display: flex;
    align-items: center;
    gap: 24px;
    font-size: 20px;
}

.img__dropdown {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
}

.dropdown__button {
    display: flex;
    align-items: center;
    gap: 16px;
    border-radius: 11px;
    border: 1px solid #000;
    padding: 8px 12px;
}

.dropdown__icon {
    display: flex;
    align-items: center;
}

.img__item-del {
    position: absolute;
    top: 20px;
    right: 24px;
}

.img-list__inner {
    display: flex;
    width: 100%;
    max-width: 410px;
    justify-content: space-between;
    padding-right: 109px
}

.dropdown__icon {
    transition: transform 0.3s ease-in-out;
}

.img__dropdown:hover {
    cursor: pointer;
}

.img__dropdown:hover .dropdown__icon {
    transform: rotate(180deg);
}

.img__item-del:hover {
    cursor: pointer;
}

.dropdown__options {
    display: none;
    gap: 16px;
    flex-wrap: wrap;
    padding: 48px;
    border-radius: 17px;
    border: 1px solid #01257D;
    background: #FEFDF9;
    width: 330px;
    z-index: 5;
    cursor: default;
    position: absolute;
    top: 100%;
    left: 0;
}

.img__dropdown:hover .dropdown__options {
    display: flex;
    position: absolute;
    top: 90%;
    left: 40px;
}

.dropdown__options button {
    flex-basis: calc(33.33% - 11px);
    padding: 16px 0;
    background-color: #01257D;
    border-radius: 5px;
    color: #FEFDF9;
    transition: background-color 0.3s;
    font-size: 24px;
    font-weight: 400;
    text-align: center;
}

.dropdown__options button:hover {
    background-color: #00AEFF;
}

.img-convertor-panel {
    display: flex;
    justify-content: space-between;
    padding: 15px 24px;
    background: #01257D;
    border-radius: 20px;
    margin-top: 100px;
}

.img-convertor-panel .button {
    padding: 16px 24px;
    border: 1px solid #FAFEF2;
    color: #FAFEF2;
    font-size: 20px;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
}

.button.convert {
    background: #FAFEF2;
    color: #202020;
}

.button.convert svg path {
    fill: #202020;
    transition: fill 0.3s;
}

.img-convertor-panel .button:hover {
    border-color: #00AEFF;
    background-color: #00AEFF;
}

.button.convert:hover {
    color: #FAFEF2;
}

.button.convert:hover svg path {
    fill: #FAFEF2;
}

.converto-to {
    font-size: 20px;
    font-weight: 500;
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px
}

.img-convertor-panel.processed {
    justify-content: center;
}

a .button {
    padding: 16px 24px;
    font-size: 20px;
    border-radius: 44px;
}
</style>
