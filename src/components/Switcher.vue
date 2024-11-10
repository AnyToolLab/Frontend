<script setup lang="ts">

import { ref } from 'vue';

const isRight = ref(false);

function handleClick() {
    isRight.value = !isRight.value;
}

</script>

<template>
    <div @click="handleClick" class="switcher">
        <div :class="{ 'switcher__circle--right': isRight }" class="switcher__circle"></div>
    </div>
</template>

<style scoped>

.switcher {
    width: 66px;
    height: 31px;
    background-color: #01257D;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
}

.switcher__circle {
    position: absolute;
    background-color: #FEFDF9;
    border-radius: 20px;
    height: 31px;
    width: 29px;
    top: 0;
    left: 1px;
    transition: transform 0.3s ease;
}

.switcher__circle--right {
    transform: translateX(35px);
}

</style>