<script setup lang="ts">

import Header from './layout/Header.vue';
import Footer from './layout/Footer.vue';

import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    router.afterEach(scrollToTop);
});

onBeforeUnmount(() => {
    router.afterEach(() => { });
});

</script>

<template>
    <Header />
    <router-view />
    <Footer />
</template>

<style scoped></style>
