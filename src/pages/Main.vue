<script setup lang="ts">

import archiveIMG from '../assets/images/archive.png'
import bgRemoverIMG from '../assets/images/bg-remover.png'
import fakerIMG from '../assets/images/faker.png'
import imgConvertorIMG from '../assets/images/img-convertor.png'
import imgResizerIMG from '../assets/images/img-resizer.png'
import qrCodeIMG from '../assets/images/qr-code.png'
import frameIMG from '../assets/images/mainpage/frame.svg'
import tookitIMG from '../assets/images/mainpage/toolkit.png'

</script>

<template>
    <main class="main">
        <div class="container">
            <div class="main__content">
                <div class="main__welcome">
                    <h1 class="main__welcome-title">Welcome to AnyToolLab!</h1>
                    <div class="main__welcome-text">Everything you were looking for is available in a few clicks</div>
                </div>
                <div class="main__tools">
                    <h3 class="main__tools-title">Our Tools</h3>

                    <div class="main__tools-wrapper">
                        <div class="main__tools-items">
                            <RouterLink to="/qrcode-generator" class="main__tools-item">
                                <img :src="qrCodeIMG" alt="qrcode" class="tools__item-img">
                                <div class="tools__item-text">QR-code</div>
                            </RouterLink>
                            <RouterLink to="/img-convertor" class="main__tools-item">
                                <img :src="imgConvertorIMG" alt="imgconverter" class="tools__item-img">
                                <div class="tools__item-text">Img converter</div>
                            </RouterLink>
                            <RouterLink to="/crop-image" class="main__tools-item">
                                <img :src="imgResizerIMG" alt="imgresizer" class="tools__item-img">
                                <div class="tools__item-text">Img crop</div>
                            </RouterLink>
                            <RouterLink to="/faker" class="main__tools-item">
                                <img :src="fakerIMG" alt="faker" class="tools__item-img">
                                <div class="tools__item-text">Faker</div>
                            </RouterLink>
                            <RouterLink to="/archiver" class="main__tools-item">
                                <img :src="archiveIMG" alt="archive" class="tools__item-img">
                                <div class="tools__item-text">Archiver</div>
                            </RouterLink>
                            <RouterLink to="/bg-remover" class="main__tools-item">
                                <img :src="bgRemoverIMG" alt="bgremover" class="tools__item-img">
                                <div class="tools__item-text">BG remover</div>
                            </RouterLink>
                        </div>
                        <div class="main__tools-img">
                            <img :src="frameIMG" alt="frame" class="main__tools-frame">
                            <img :src="tookitIMG" alt="" class="main__tools-frame-img">
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
}

.main__content {
    color: #202020;
    display: flex;
    flex-direction: column;
}

.main__tools-wrapper {
    display: flex;
    justify-content: space-between;
}

.main__tools {
    margin-top: 104px;
}

.main__tools-title {
    margin-bottom: 55px;
    font-size: 36px;
}

.main__tools-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 25px;
}

.main__tools-item {
    border: 2px solid #01257D;
    border-radius: 20px;
    max-width: 193px;
    height: auto;
    padding: 0px 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out;
}

.main__tools-item:hover {
    box-shadow: 2px 3px 4px 0px rgb(170, 170, 170);
}

.tools__item-text {
    font-size: 24px;
    font-weight: 600;
    line-height: 36px;
    text-align: center;
    max-width: 162px;
}

.main__welcome {
    background-color: #01257D;
    color: #FEFDF9;
    padding: 55px 30px;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.main__welcome-title {
    font-size: 36px;
}

.main__welcome-text {
    margin-top: 24px;
}

.main__tools-img {
    display: inline-block;
    position: relative;
}

.main__tools-frame-img {
    position: absolute;
    z-index: 99;
    top: -60px;
    right: 100px;

}
</style>
