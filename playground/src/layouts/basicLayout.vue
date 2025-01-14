<script setup lang="ts">
import Logo from './logo/index.vue'
import Nav from './nav/index.vue'
import Sidebar from './sidebar/index.vue'

</script>

<template>
    <div class="layout">
        <header class="layout-header">
            <Logo />

            <Nav />
        </header>

        <Sidebar />
        <main class="layout-main">
            
            <router-view />
        </main>
    </div>
</template>

<style>
:root {
    --layout-header-height: 60px;
    --layout-margin-top: calc(60px + 32px);
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

}

.logo-pic {
    width: 40px;
    height: 40px;
    background: #f0e5e5;
    border-radius: 20%;
}

.logo-text {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.layout {
    width: 100%;
    /* height: 100%; */
}

.layout-header {
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

.layout-main {
    padding: 0 32px;
    box-sizing: border-box;
    max-width: 1280px;
    min-width: 460px;
    margin: var(--layout-margin-top) auto;
    /* overflow-y: auto; */
    padding-left: 320px;
}

@media screen and (max-width: 1000px) {
    .layout-main {
        max-width: 680px;
    }
}

@media screen and (max-width: 640px) {
    .table-of-contents {
        display: none;
    }
}
</style>
