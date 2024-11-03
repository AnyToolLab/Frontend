<script setup lang="ts">
</script>

<template>
    <footer class="footer">
        <div class="container">
            <div class="footer__content">
                <div class="footer__rights">
                    <div class="footer__rights-title footer__title">AnyTools, 2024. All rights reserved.</div>
                    <p class="footer__rights-text footer__text">Our service offers professional tools for working with graphics, text and data. Designed for convenience, efficiency and reliability.</p>
                </div>
                <div class="footer__contacts">
                    <div class="footer__contacts-title footer__title">Contacts</div>
                    <p class="footer__contacts-text footer__text">support@toolhub.com | +380 (44) 123-45-67</p>
                </div>
                <div class="footer__policy">
                    <RouterLink to="#">Privacy Policy</RouterLink>
                    | 
                    <RouterLink to="#">Terms of Use</RouterLink>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
    .footer {
        background-color: #01257D;
        color: #FEFDF9;
        height: 372px;
        font-size: 20px;
        font-weight: 400;
    }

    .footer__content {
        position: relative;
        height: 100%;
    }

    .footer__title {
        font-size: 24px;
        font-weight: 700;
    }

    .footer__text {
        line-height: 30px;
    }

    .footer__rights {
        padding-top: 48px;
        max-width: 721px;
    }

    .footer__rights-title {
        margin-bottom: 24px;
    }

    .footer__contacts-title {
        /* margin-bottom: 12px; */
    }

    .footer__contacts {
        margin-top: 24px;
    }

    .footer__policy {
        position: absolute;
        bottom: 54px;
        right: 0;
    }
</style>
