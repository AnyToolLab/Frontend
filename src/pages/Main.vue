<script setup lang="ts">

import archiveIMG from '../assets/images/archive.png'
import bgRemoverIMG from '../assets/images/bg-remover.png'
import fakerIMG from '../assets/images/faker.png'
import imgConvertorIMG from '../assets/images/img-convertor.png'
import imgResizerIMG from '../assets/images/img-resizer.png'
import qrCodeIMG from '../assets/images/qr-code.png'

</script>

<template>
    <main class="main">
        <div class="container">
            <div class="main__content">
                <div class="main__welcome">
                    <h1 class="main__welcome-title">Welcome to AnyTools!</h1>
                    <div class="main__welcome-text">Everything you were looking for is available in a few clicks</div>
                </div>
                <div class="main__tools">
                    <h3 class="main__tools-title">Our Tools</h3>
                    <div class="main__tools-items">
                        <div class="main__tools-item">
                            <img :src="qrCodeIMG" alt="qrcode" class="tools__item-img">
                            <div class="tools__item-text">QR-code</div>
                        </div>
                        <div class="main__tools-item">
                            <img :src="imgConvertorIMG" alt="imgconverter" class="tools__item-img">
                            <div class="tools__item-text">IMG convertor</div>
                        </div>
                        <div class="main__tools-item">
                            <img :src="imgResizerIMG" alt="imgresizer" class="tools__item-img">
                            <div class="tools__item-text">IMG resizer</div>
                        </div>
                        <div class="main__tools-item">
                            <img :src="fakerIMG" alt="faker" class="tools__item-img">
                            <div class="tools__item-text">Faker</div>
                        </div>
                        <div class="main__tools-item">
                            <img :src="archiveIMG" alt="archive" class="tools__item-img">
                            <div class="tools__item-text">Archive</div>
                        </div>
                        <div class="main__tools-item">
                            <img :src="bgRemoverIMG" alt="bgremover" class="tools__item-img">
                            <div class="tools__item-text">BG remover</div>
                        </div>
                    </div>
                    <img src="" alt="" class="main__tools-img">
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>
