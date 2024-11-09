<script setup lang="ts">

import ArrowDownIMG from '../assets/images/arrow-down.svg'

</script>

<template>
    <div class="header">
        <div class="container">
            <div class="header__content">
                <RouterLink to="/" class="header__logo-text header__text">
                    AnyTools
                </RouterLink>
                <div class="header__tools">
                    <div class="header__tools-text">
                        Tools
                        <img :src="ArrowDownIMG" alt="arrow-down" class="header__tools-img">
                    </div>
                    <div class="header__tools-menu">
                        <RouterLink class="header__tools-item" to="/qrcode-generator">QR-code</RouterLink>
                        <RouterLink class="header__tools-item" to="/img-convertor">IMG convertor</RouterLink>
                        <RouterLink class="header__tools-item" to="/crop-image">Crop IMG </RouterLink>
                        <RouterLink class="header__tools-item" to="/faker">Faker</RouterLink>
                        <RouterLink class="header__tools-item" to="/archive">Archive</RouterLink>
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
    margin-right: 130px;
    cursor: pointer;
    position: relative;
}

.header__tools:hover {
    z-index: 100;

    .header__tools-menu {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        top: 40px;
        right: -68px;
    }
}

.header__tools-text {}

.header__tools-img {
    padding-left: 16px;

}

.header__tools-menu {
    display: none;
    background-color: #FEFDF9;
    color: #202020;
    font-size: 20px;
    font-weight: 500;

    height: 308px;
    width: 210px;
    border-radius: 20px;
    padding: 24px 24px 24px 46px;
    border: 1px solid #01257D;
}
</style>
