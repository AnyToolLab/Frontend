<script setup lang="ts">

import { ref } from 'vue';

const circleSide = ref<string>('left');

function handleClick() {
    circleSide.value = circleSide.value === 'left' ? 'right' : 'left';
}

</script>

<template>
    <div :onclick="() => handleClick()" class="switcher">
        <div :style="{ left: circleSide === 'left' ? '0' : 'auto', right: circleSide === 'right' ? '0' : 'auto' }" class="switcher__circle">
        </div>
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
    left: 0;
    margin: 0 1px;
}

.switcher__circle-right {
    right: 0;
}

</style>
