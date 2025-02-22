<script setup lang="ts">
import Logo from './logo/index.vue'
import Nav from './nav/index.vue'

const navItems = [
    {
        name: 'ProComponent',
        url: '/procomponent/'
    },
    {
        name: 'Data V',
        url: '/datav/'
    },
    {
        name: 'GitHub',
        url: 'https://github.com/banmao/ui-lib'
    }
]

console.log('home layout')
</script>

<template>
    <div class="home-layout">
        <header class="home-layout-header">
            <Logo />
            <nav class="nav">
                <a v-for="item in navItems" :key="item.url" :href="item.url" class="nav-item"
                    :target="item.url.startsWith('http') ? '_blank' : '_self'">
                    {{ item.name }}
                </a>
            </nav>
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
    background-color: var(--bg-color, #ffffff);
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    transition: all 0.3s ease;
}

.home-layout-main {
    padding: 0 32px;
    box-sizing: border-box;
    max-width: 1440px;
    min-width: 320px;
    margin: var(--layout-margin-top) auto;
}

.nav {
    display: flex;
    gap: 32px;
    align-items: center;
}

.nav-item {
    color: #666;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    padding: 4px 0;
}

.nav-item:hover {
    color: #4285f4;
}

.nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #4285f4;
    transition: width 0.3s ease;
}

.nav-item:hover::after {
    width: 100%;
}

@media (max-width: 768px) {
    .nav {
        gap: 16px;
    }

    .nav-item {
        font-size: 14px;
    }
}
</style>