<script setup lang="ts">
import Header from './header/index.vue'
</script>

<template>
    <div class="home-layout">
        <Header />

        <main class="home-layout-main">
            <router-view />
        </main>
    </div>
</template>

<style scoped>
.home-layout {
    width: 100%;
    min-height: 100vh;
    background-color: var(--bg-color,rgb(13, 12, 12));
}

.home-layout-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--layout-header-height);
    padding: 0 32px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.01);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    transition: all 0.3s ease;
}

.home-layout-main {
    box-sizing: border-box;
    min-width: 320px;
    padding: var(--layout-margin-top) auto;
}
</style>