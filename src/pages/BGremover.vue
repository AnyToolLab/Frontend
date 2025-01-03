<script setup lang="ts">

import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";

import uploadIMG from '../assets/images/upload_white.svg'
import eraserIMG from '../assets/images/eraser.png'
import pensilIMG from '../assets/images/pensil.png'

import { ref } from 'vue';

const photo = ref<string>('')
const photoBG = ref<string>('')
const visiblePhoto = ref<string>('true')
const wellcomeVisible = ref<boolean>(true)


function handleUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
        const file = input.files[0];
        photo.value = URL.createObjectURL(file);
        wellcomeVisible.value = false;
    }
}

function restorePhoto() {
    visiblePhoto.value = 'true'
}

async function removeBackground() {

    const outputStride = 16;
    const segmentationThreshold = 0.5;

    const img = new Image();
    img.src = photo.value;

    await new Promise(resolve => {
        img.onload = resolve;
    });

    const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: outputStride,
    });

    const segmentation = await net.segmentPerson(img, {
        internalResolution: 'high',
        segmentationThreshold: segmentationThreshold
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    segmentation.data.forEach((value, index) => {
        if (value === 0) { 
            data[index * 4 + 3] = 0; 
        }
    });

    ctx.putImageData(imageData, 0, 0);
    photoBG.value = canvas.toDataURL();

    visiblePhoto.value = 'false';
}


</script>

<template>
    <div class="backgorundrm">
        <div class="container">
            <div class="backgorundrm__wrapper">
                <h1 class="custom__title">Background remover</h1>
                <div class="backgroundrm__content">
                    <div
                    :style="{display: wellcomeVisible ? 'flex' : 'none'}"
                    class="backgroundrm__wellcome">
                        <div class="backgroundrm__wellcome-text">Transfer the image to remove the background</div>
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
                    <div
                    :style="{display: wellcomeVisible ? 'none' : 'flex'}"
                    class="backgroundrm__workbanch">
                        <div class="backgroundrm__workbanch-result">
                            <img 
                            :src="visiblePhoto === 'true' ? photo : photoBG"
                            alt="" class="backgroundrm__workbanch-img">
                        </div>
                        <div class="backgroundrm__workbanch-buttons">
                            <button @click="removeBackground" class="backgroundrm__workbanch-button workbanch__erase-button active-button">
                                <img :src="eraserIMG" alt="eraser" class="workbanch__button-img">
                                <div class="workbanch__button-text">Erase</div>
                            </button>
                            <button @click="restorePhoto"  class="backgroundrm__workbanch-button active-button">
                                <img :src="pensilIMG" alt="pensil" class="workbanch__button-img workbanch__button-resotre">
                                <div class="workbanch__button-text">Restore</div>
                            </button>
                        </div>
                        <div class="backgroundrm__workbanch-download">
                            <a :href="photoBG" download="edited_image.png" class="background__workbanch-link">Download</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.backgorundrm {
    height: 100%;
}

.backgroundrm__content {
    width: 100%;
}

.backgorundrm__wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
}

.backgroundrm__wellcome {
    max-width: 538px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 122px;
}

.backgroundrm__wellcome-text {
    font-weight: 500;
    line-height: 48px;
    text-align: center;
    margin-bottom: 48px;
}

.backgroundrm__wellcome-input {
    height: 84px;
    width: 368px;
    border-radius: 56px;
    background-color: #01257D;
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

.backgroundrm__wellcome-label:hover {
    background-color: #00AEFF;
    color: #FEFDF9;
    transition: all 0.3s;
}

.background__label-img {
    margin-left: 16px;   
    fill: #FEFDF9;
}

.backgroundrm__workbanch {
    display: flex;
    justify-content: space-between;
}

.backgroundrm__workbanch-result {
    height: 386px;
    width: 628px;
    border-radius: 20px;
    background-color: #01257D;
}

.backgroundrm__workbanch-img {
    display: block;
    margin: 0 auto;
    max-width: 628px;
    max-height: 386px;
}

.backgroundrm__workbanch-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 75px;
    max-width: 265px;
}

.backgroundrm__workbanch-button {
    border-radius: 47px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;
    font-weight: 500;
    font-size: 24px;
}

.backgroundrm__workbanch-button:hover {
    background-color: #00AEFF;
    color: #FEFDF9;
    transition: all 0.3s;
}

.active-button {
    background-color: #01257D17;
}

.workbanch__button-resotre {
    margin-right: 40px;
}

.workbanch__erase-button {
    max-width: 160px;
}

.backgroundrm__workbanch-download {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.background__workbanch-link {
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
    padding: 16px 37px;
    background-color: #01257D;
    color: #FEFDF9;
    border-radius: 42px;
}

.background__workbanch-link:hover {
    background-color: #00AEFF;
    color: #FEFDF9;
    transition: all 0.3s;
}

</style>
