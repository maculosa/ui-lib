<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const activePath = computed(() => {
    return route.path
})

</script>

<template>
    <aside class="sidebar">
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
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    width: 320px;
    background-color: var(--bg-color);
    padding: 48px 32px;
    box-sizing: border-box;
    overflow-y: auto;
    transform: translate(0);
    background-color: #fff;
    box-shadow: -2px 6px 4px 0 rgba(0, 0, 0, 0.3);
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
}
.link.active {
    background-color: hsla(210, 100%, 63%, 0.1);
    color: #409eff;
}

.link:not(.flex) {
    display: block;
}

.link-text:hover {
    color: #409eff;
}

a {
    font-weight: 500;
    text-decoration: inherit;
    color: #333333;
}

</style>
