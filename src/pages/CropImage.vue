<script setup lang="ts">

import miniArrowDownIMG from '../assets/images/mini-arrowdown.svg'
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { ref } from 'vue'
import uploadIMG from '../assets/images/upload.svg'

const width = ref<number>(540)
const height = ref<number>(670)
const isOpen = ref<boolean>(false)
const hoveredItem = ref(null)
const selectedItem = ref<string>('Original')
const menuItems = ref(['PNG', 'JPG', 'WEBP', 'Original'])
const cropperData = ref()
const imgToCrop = ref<string>('')
const originalFileType = ref<string>('')

function menuSwitcher() {
    isOpen.value = !isOpen.value
}

function selectItem(item: string) {
    selectedItem.value = item
    isOpen.value = false
}

async function cropperChangeHandler(event) {
  if (cropperData.value) {
    const coordinates = await cropperData.value.getResult()
    console.log(coordinates)
    if (coordinates) {
      width.value = coordinates.width;
      height.value = coordinates.height;
    }
  }
}

async function downloadCroppedImage() {
    if (cropperData.value) {
        const { canvas } = await cropperData.value.getResult();
        let imageFormat = selectedItem.value.toLowerCase()

        if (imageFormat === 'original') {
            imageFormat = originalFileType.value
        }

        const url = canvas.toDataURL(`image/${imageFormat}`)
        const link = document.createElement('a');
        link.href = url;
        link.download = `cropped-image.${imageFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const fileType = file.type;
    originalFileType.value = fileType.split("/")[1];
    if (file) {
        imgToCrop.value = URL.createObjectURL(file);
    }
}

</script>

<template>
    <div class="cropimg">
        <div class="container">
            <h1 class="custom__title">Crop Image</h1>
            <div class="cropimg__wrapper">
                <div class="cropimg__main">
                    <div class="cropimg__setting">
                        <div class="cropimg__setting-saveas">
                            <div class="setting__saveas-values">
                                <div class="saveas__value-width saveas__value">
                                    <div class="saveas__value-text">Width</div>
                                    <input v-model="width" type="number" class="saveas__value-input">
                                </div>
                                <div class="saveas__value-height saveas__value">
                                    <div class="saveas__value-text">Height</div>
                                    <input v-model="height" type="number" class="saveas__value-input">
                                </div>
                            </div>
                            <div
                                @click="menuSwitcher"
                                class="setting__saveas-menu"
                                >
                                <div class="setting__saveas-text">Save image as</div>
                                <div 
                                    class="saveas__menu"
                                    >
                                    <div class="setting__saveas-input">
                                        <div class="saveas__menu-text">{{ selectedItem }}</div>
                                        <img :src="miniArrowDownIMG" alt="miniarrow">
                                    </div>
                                    <div 
                                        v-if="isOpen"
                                        @click.stop
                                        class="saveas__menu-item"
                                        v-for="(item, index) in menuItems"
                                        :key="index"
                                        @click="selectItem(item)"
                                        @mouseover="hoveredItem = index"
                                        @mouseleave="hoveredItem = null"
                                        >{{ item }}</div>
                                </div>
                            </div>
                            <div class="download__button-wrapper">
                                <button @click="downloadCroppedImage" class="download__button">Download</button>
                            </div>
                        </div>
                    </div>
                    <div class="cropimg__area">
                        <label v-if="!imgToCrop" class="backgroundrm__wellcome-label" for="imageUpload">
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
                        <cropper 
                            v-if="imgToCrop"
                            class="cropper"
                            :src="imgToCrop"
                            ref="cropperData"
                            @change="cropperChangeHandler"
                            :stencilProps="{ movable: true, resizable: true, initialSize: { width, height } }"
                        ></cropper>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.cropimg {
    height: 100%;
}

.cropimg__wrapper {
    min-width: 1057px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cropimg__main {
    display: flex;
    justify-content: space-between;
    height: 386px;
}

.cropimg__setting {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.cropimg__setting-saveas {
    height: 100%;
}

.setting__saveas-values {
    display: flex;
    justify-content: space-between;
    width: 324px;
}

.setting__saveas-menu {
    margin-top: 48px;
    user-select: none
}

.saveas__value {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    height: 98px;
}

.saveas__value-text {
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
}

.saveas__value-input {
    border: 1px solid #01257D;
    border-radius: 35px;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    max-width: 135px;
    text-align: center;
    padding: 8px 0;

}

.setting__saveas-text {
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
}

.setting__saveas-input {
    display: flex;
    justify-content: space-between;
    border: 1px solid #01257D;
    border-radius: 23px;
    max-width: 328px;
    padding: 8px 24px 8px 32px;
    
}

.saveas__menu-text {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
}

.saveas__menu {
    border: 1px solid #01257D;
    border-radius: 24px;
    margin-top: 12px;
}

.saveas__menu-item {
    cursor: pointer;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    padding: 8px 0 8px 32px;
    border-radius: 24px;
}

.saveas__menu-item:hover {
    background: #01257D26;
}

.cropimg__area {
    height: 386px;
    width: 628px;
    border: 1px solid #000000;
    margin-left: 107px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cropper {
    height: 386px;
    width: 628px;
    background-color: white;
}

.download__button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 64px;
}

.download__button {
    background-color: #01257D;
    font-size: 24px;
    font-weight: 600;
    line-height: 36px;
    color: #FEFDF9;
    padding: 16px 32px;
    border-radius: 40px;
}

.backgroundrm__wellcome-input {
    display: none;
}

.backgroundrm__wellcome-label {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 84px;
    width: 368px;
    border-radius: 56px;
    background-color: #01257D;
    color: #FEFDF9;
    font-weight: 500;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
}

.background__label-img {
    margin-left: 16px;   
}

</style>
