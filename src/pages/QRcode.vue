<script setup lang="ts">

import { ref, watch } from 'vue'

import qrcodePlug from '../assets/images/qrcode-dev.png'
import uploadIMG from '../assets/images/upload.svg'
import penIMG from '../assets/images/pen.png'
import Switcher from '../components/Switcher.vue'
import axios from 'axios'

const previewQRCODE = ref<string>('')
const fileTypes = [ '.png', '.jpg', '.gif' ]
const hoveredItem = ref(null)
const colors = ['#202020', '#D90004', '#01257D', '#002E14']
const colorPickerVisible = ref<boolean>(false)

const qrcodeText = ref<string>('')
const qrcodeColor = ref<string>('#000000'); 
const qrcodeBackgroundColor = ref<string>('#ffffff'); 
const backgroundIMG = ref<File | null>(null)
const selectedFileType = ref<string>('.png')

const SERVER_URL = 'http://159.223.218.22:8000'

// TODO add types

function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    backgroundIMG.value = file
}

function selectItem(item: string) {
    selectedFileType.value = item
}

function setQRcodeColor(color: string) {
    qrcodeColor.value = color
}

function setQRcodeBackgroundColor(color: string) {
    qrcodeBackgroundColor.value = color
}

async function generateQRcode() {
    const form = new FormData()

    if (backgroundIMG.value) {
        form.append('background_img', backgroundIMG.value)
    } else {
        form.append('background_color', qrcodeBackgroundColor.value)
    }

    form.append('content', qrcodeText.value)
    form.append('color', qrcodeColor.value)
    form.append('save_format', selectedFileType.value)

    const response = await axios.post(`${SERVER_URL}/qrcode/generate/`, form)
    previewQRCODE.value = SERVER_URL + response.data.data.url
}

function debounce(fn: Function, delay: number) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay)
    }
}

const debouncedGenerateQRcode = debounce(() => {
    generateQRcode()
}, 500)

watch([
    qrcodeText,
    qrcodeColor,
    qrcodeBackgroundColor,
    backgroundIMG,
    selectedFileType
], () => {

    if (qrcodeText.value) {
        debouncedGenerateQRcode()
    } else {
        return;
    }
})

function adjustHeight(event) {
    const element = event.target
    element.style.height = "auto"
    element.style.height = `${element.scrollHeight}px`
}

</script>

<template>
    <div class="qrcode">
        <div class="container">
            <h1 class="custom__title">QR-code generator</h1>
            <div class="qrcode__wrapper">
                <div class="qrcode__settings">
                    <div class="qrcode__settings-type">
                        URL 
                        <switcher></switcher>
                        Text
                    </div>
                    <textarea
                        v-model="qrcodeText"
                        type="text"
                        rows="1" 
                        @input="adjustHeight($event)"
                        class="qrcode__settings-input">
                    </textarea>
                    
                    <div class="qrcode__settings-color">
                        <div class="settings__color-title">Customize your QR</div>
                        <div class="settings__color-text">Choose the color you like</div>
                        <div class="color__items">
                            <div
                                v-for="(color, index) in colors"
                                :key="index"
                                :style="{ backgroundColor: color }"
                                class="color__item"
                                @click="setQRcodeColor(color)"
                            ></div>
                            <div class="color__item colorpicker">
                                <label
                                    for="color"
                                    class="color__picker-bg"
                                    :style="{backgroundColor: qrcodeColor == '#000000' ? '#ffffff' : qrcodeColor }"></label>
                                <input v-model="qrcodeColor" type="color" id="color" class="color__picker">
                                <img v-if="!colorPickerVisible" :src="penIMG" alt="pen" class="settings__colorpicker-img">
                            </div>
                        </div>
                    </div>

                    <div class="qrcode__settings-backgroundIMG">
                        <div class="settings__backgroundIMG-text">OR Choose the image you like</div>
                        <label class="backgroundrm__wellcome-label" for="imageUpload">
                            Choose the image
                            <img :src="uploadIMG" alt="" class="background__label-img">
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            class="backgroundrm__wellcome-input"
                            @change="handleUpload"
                        >
                    </div>
                    
                    <div class="qrcode__settings-backgroundColor">
                        <div class="settings__color-text">Choose the color for background</div>
                        <div class="color__items">
                            <div
                                v-for="(color, index) in colors"
                                :key="index"
                                :style="{ backgroundColor: color }"
                                class="color__item"
                                @click="setQRcodeBackgroundColor(color)"
                            ></div>
                            <div class="color__item colorpicker">
                                <label 
                                    :style="{backgroundColor: qrcodeBackgroundColor == '#ffffff' ? '#ffffff' : qrcodeBackgroundColor }"
                                    for="color"
                                    class="color__picker-bg"></label>
                                <input
                                    type="color"
                                    id="color"
                                    v-model="qrcodeBackgroundColor"
                                    class="color__picker">
                                <img
                                    :src="penIMG"
                                    alt="pen"
                                    class="settings__colorpicker-img">
                            </div>
                        </div>
                    </div>
                    
                    <div class="qrcode__settings-save">
                        <div class="qrcode__save-title">Save format</div>
                        <div class="qrcode__save-formats">
                            <div 
                                v-for="(item, index) in fileTypes"
                                :key="index"
                                class="saveas__menu-item"
                                @click.stop="selectItem(item)"
                                @mouseover="hoveredItem = index"
                                @mouseleave="hoveredItem = null"
                            >{{ item }}</div>
                        </div>
                    </div>
                    <div class="qrcode__download">
                        <a :href="previewQRCODE" class="qrcode__download-button">Download</a>
                    </div>
                </div>
                
                <div class="qrcode__preview">
                    <img :src="previewQRCODE ? previewQRCODE : qrcodePlug" alt="preview" class="qrcode__preview-img">
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

.file__name {
    display: inline;
    height: 10px;
}

.backgroundrm__wellcome-input {
    display: none;
}

.backgroundrm__wellcome-label {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    width: 197px;
    border-radius: 10px;
    background-color: inherit;
    border: 1px solid #01257D;
    color: #000000;
    text-align: center;
    cursor: pointer;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}

.background__label-img {
    margin-left: 10px;   
    width: 11px;
    height: 14px;
    color: #000000;
}

.qrcode {
    height: 100%;
}

.qrcode__wrapper {
    display: flex;
    justify-content: space-between;
    padding-top: 155px;
    padding-bottom: 157px;
}

.qrcode__settings {
    max-width: 572px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 4px solid #01257D;
    border-radius: 20px;
    padding: 24px;
}

.qrcode__settings-type {
    display: flex;
    justify-content: space-between;
    width: 188px;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
}

.qrcode__settings-input {
    border-radius: 42px;
    border: 1px solid #01257D;
    min-width: 557px;
    margin: 27px 0;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    padding: 12px 24px;
    min-width: 509px;
    overflow-y: hidden;
    resize: none;
}

.qrcode__settings-color {

}

.settings__color-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
}

.settings__color-text {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 8px 0 16px 0;
}

.color__items {
    display: flex;
    justify-content: space-between;
    max-width: 376px;
}

.color__item {
    height: 56px;
    width: 56px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
}

.colorpicker {
    border: 1px solid #01257D;
    display: flex;
    align-items: center;
    justify-content: center;
}

.settings__colorpicker-img {
}

.qrcode__settings-backgroundIMG {
}

.settings__backgroundIMG-text {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 24px 0 16px 0;
}

.qrcode__settings-backgroundColor {

}

.qrcode__settings-save {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 24px 0 16px 0;
}

.qrcode__save-title {
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 16px;
}

.qrcode__save-formats {
    display: flex;
    justify-content: space-between;
    max-width: 228px;
}

.saveas__menu-item {
    border: 1px solid #01257D;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    width: 62px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    cursor: pointer;
}

.qrcode__download {
    display: flex;
    justify-content: center;
}

.qrcode__download-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #01257D;
    color: #FEFDF9;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    padding: 8px 24px;
    width: 132px;
    height: 40px;
}

.qrcode__preview {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #01257D;
    border-radius: 20px;
}

.qrcode__preview-img {
    width: 398px;
    height: 398px;
}

.color__picker {
    opacity: 0;
    position: absolute;
    top: 15px;
    left: -24px;
    width: 100%;
    height: 100%;
    cursor: pointer;
}


.color__picker-bg {
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -999;
}

</style>
