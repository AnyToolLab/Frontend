<script setup lang="ts">

import ArrowDownIMG from '../assets/images/arrow-down.svg'

</script>

<template>
    <div class="header">
        <div class="container">
            <div class="header__content">
                <RouterLink to="/" class="header__logo-text header__text">
                    AnyToolLab
                </RouterLink>
                <div class="header__tools">
                    <div class="header__tools-text">
                        Tools
                        <img :src="ArrowDownIMG" alt="arrow-down" class="header__tools-img">
                    </div>
                    <div class="header__tools-menu">
                        <RouterLink class="header__tools-item" to="/qrcode-generator">QR-code</RouterLink>
                        <RouterLink class="header__tools-item" to="/img-convertor">Img converter</RouterLink>
                        <RouterLink class="header__tools-item" to="/crop-image">Crop Img</RouterLink>
                        <RouterLink class="header__tools-item" to="/faker">Faker</RouterLink>
                        <RouterLink class="header__tools-item" to="/archiver">Archiver</RouterLink>
                        <RouterLink class="header__tools-item" to="/bg-remover">BG remover</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    background-color: #01257D;
    height: 84px;
    color: #FEFDF9;
}

.header__content {
    display: flex;
    justify-content: space-between;
    height: 84px;
    align-items: center;
}

.header__logo-text {
    font-weight: bold;
    font-size: 24;
}

.header__tools {
    cursor: pointer;
    position: relative;
}

.header__tools-img {
    max-width: 20px;
    height: auto;
    transition: transform 0.3s ease-in-out;
}

.header__tools:hover {
    z-index: 100;

    .header__tools-menu {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 17px;
        right: -68px;
    }

    .header__tools-img {
        transform: rotate(180deg);
    }
}

.header__tools-text {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
}

.header__tools-menu {
    display: none;
    background-color: #FEFDF9;
    color: #202020;
    font-size: 20px;
    font-weight: 500;

    width: 170px;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid #01257D;

    cursor: default;
}

.header__tools-item {
    color: #202020;
    cursor: pointer;
    transition: color 0.3s ease;
}

.header__tools-item:hover {
    color: #0077cc;
}
</style>
