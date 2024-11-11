<script setup lang="ts">

import robotDolboebIMG from '../assets/images/404/robotdalboeb.svg'

</script>

<template>
    <div class="error">
        <div class="container">
            <div class="error__wrapper">
                <div class="error__content">
                    <h3 class="error__content-title">Oops!</h3>
                    <img :src="robotDolboebIMG" alt="404" class="error__content-img">
                </div>
                <p class="error__text">
                    The page you’re looking for doesn’t seem to exist.
                    It might have been moved, renamed, or deleted.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.error {

}

.error__wrapper {
    max-width: 920px;
    margin: 0 auto;
}

.error__content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.error__content-title {

}

.error__content-img {
    width: 500px;
    height: 500px;
}

.error__text {
    margin: 0 auto;
    margin-bottom: 104px;
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
    max-width: 640px;
}

</style>