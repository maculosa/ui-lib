<script setup lang="ts">
import Logo from './logo/index.vue'
import Nav from './nav/index.vue'
import Sidebar from './sidebar/index.vue'

console.log('default.vue')
</script>

<template>
    <div class="layout">
        <header class="layout-header">
            <Logo />

            <Nav />
        </header>

        <section class="flex-1 flex gap-10">
            <div class="w-80 relative">
                <Sidebar />
            </div>
            <main class="layout-main flex-1">
                <router-view />
            </main>
            <aside class="relative w-320px bg-emerald-400/10 mt-15">
                
            </aside>
        </section>
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
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100dvh;
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
    /* padding: 0 32px; */
    box-sizing: border-box;
    /* max-width: 1280px; */
    min-width: 460px;
    /* margin: 0 auto; */
    /* overflow-y: auto; */
    padding-top: var(--layout-margin-top);
    /* padding-left: 320px; */
}

@media screen and (max-width: 1000px) {
    .layout-main {
        max-width: 680px;
        padding-left: 0;
        margin: 0 auto;
    }
}

@media screen and (max-width: 640px) {
    .table-of-contents {
        display: none;
    }
}
</style>
