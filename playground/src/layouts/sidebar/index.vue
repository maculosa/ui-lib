<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const activePath = computed(() => {
    return route.path
})

</script>

<template>
    <aside class="sidebar dark:text-white/80">
        <div class="sidebar-groups">
            <section class="sidebar-group">
                <p class="sidebar-group__title">Overview</p>
                <a class="link" :class="{ active: activePath === '/procomponent/overview' }" href="/procomponent/overview">
                    <span class="link-text">Overview</span>
                </a>
            </section>
            <section class="sidebar-group">
                <p class="sidebar-group__title">ProComponent</p>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-form' }" href="/procomponent/pro-form">
                    <span class="link-text">ProForm</span>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-table' }" href="/procomponent/pro-table">
                    <span class="link-text">ProTable</span>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-descriptions' }" href="/procomponent/pro-descriptions">
                    <span class="link-text">ProDescriptions</span>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-text' }" href="/procomponent/pro-text">
                    <span class="link-text">ProText</span>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/watermark' }" href="/procomponent/watermark">
                    <span class="link-text">Watermark</span>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/naive-provider' }" href="/procomponent/naive-provider">
                    <span class="link-text">NaiveProvider</span>
                </a>
            </section>

            <section class="sidebar-group">
                <p class="sidebar-group__title">Data V</p>
                <a class="link" :class="{ active: activePath === '/datav/bar_line' }" href="/datav/bar_line">
                    <span class="link-text">Bar/Line</span>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/cube_bar' }" href="/datav/cube_bar">
                    <span class="link-text">Cube Bar</span>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/circle_bar' }" href="/datav/circle_bar">
                    <span class="link-text">Circle Bar</span>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/pie' }" href="/datav/pie">
                    <span class="link-text">Pie</span>
                </a>
            </section>

            <section class="sidebar-section">
                <p class="sidebar-group__title">Blocks</p>
                <a class="link" :class="{ active: activePath === '/blocks/accordion' }" href="/blocks/login">
                    <span class="link-text">Login</span>
                </a>
            </section>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 80px;
    bottom: 16px;
    left: 16px;
    width: 320px;
    background-color: transparent;
    padding: 48px 32px;
    box-sizing: border-box;
    overflow-y: auto;
    transform: translate(0);
    @apply backdrop-blur-1 rounded-2 shadow;
    transition: all 0.5s cubic-bezier(.19, 1, .22, 1);
    z-index: 999;
    &:hover {
        box-shadow: 0px 6px 4px 0 rgba(0, 0, 0, 0.3);
    }
}

@media screen and (max-width: 1000px) {
    .sidebar {
        padding: 48px 32px;
        width: calc(200px + 32px);
    }
}

@media screen and (max-width: 960px) {
    .sidebar {
        z-index: 99;
        top: 55px;
        transform: translate(0);
    }
}

.sidebar .sidebar-groups {
    padding: 0;
}

.sidebar .sidebar-groups .sidebar-group__title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 24px;
}

.link {
    padding: 10px 16px;
    line-height: 1.5;
    font-size: 0.9rem;
    border-radius: 8px;
    position: relative;
    transition: all 0.3s cubic-bezier(.19, 1, .22, 1);

    &:hover {
        @apply bg-primary/5;
        transform: translateX(4px);

        .link-text {
            @apply text-primary;
        }
    }

}
.link.active {
    position: relative;
    @apply text-primary bg-primary/10;
    transform: none;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        @apply bg-primary shadow-[0 0 0 1px] shadow-primary;
        border-radius: 8px 0 0 8px;
        transition: all 0.3s cubic-bezier(.19, 1, .22, 1);
        transform: scaleY(1);
        transform-origin: left;
        opacity: 1;
        z-index: 1;
    }

    &:hover {
        transform: none;
    }
}

.lint-text {
    transition: color 0.3 ease;
}

.link:not(.flex) {
    display: block;
}

a {
    font-weight: 500;
    text-decoration: inherit;
    @apply text-dark dark:text-white/60;
}


</style>
