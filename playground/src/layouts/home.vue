<script setup lang="ts">
import Logo from './logo/index.vue'
import Nav from './nav/index.vue'
</script>

<template>
    <div class="home-layout">
        <header class="home-layout-header">
            <Logo />
            <Nav />
        </header>

        <main class="home-layout-main">
            <router-view />
        </main>
    </div>
</template>

<style scoped>
.home-layout {
    width: 100%;
    min-height: 100vh;
}

.home-layout-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--layout-header-height);
    padding: 0 16px;
    padding-right: 32px;
    box-sizing: border-box;
    background: transparent;
    backdrop-filter: blur(5px);
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
}

.home-layout-main {
    padding: 0 32px;
    box-sizing: border-box;
    max-width: 1280px;
    min-width: 460px;
    margin: var(--layout-margin-top) auto;
}
</style>