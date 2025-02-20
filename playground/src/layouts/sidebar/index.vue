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
                    <p class="link-text">Overview</p>
                </a>
            </section>
            <section class="sidebar-group">
                <p class="sidebar-group__title">ProComponent</p>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-table' }" href="/procomponent/pro-table">
                    <p class="link-text">ProTable</p>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-descriptions' }" href="/procomponent/pro-descriptions">
                    <p class="link-text">ProDescriptions</p>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/pro-text' }" href="/procomponent/pro-text">
                    <p class="link-text">ProText</p>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/watermark' }" href="/procomponent/watermark">
                    <p class="link-text">Watermark</p>
                </a>
                <a class="link" :class="{ active: activePath === '/procomponent/naive-provider' }" href="/procomponent/naive-provider">
                    <p class="link-text">NaiveProvider</p>
                </a>
            </section>

            <section class="sidebar-group">
                <p class="sidebar-group__title">Data V</p>
                <a class="link" :class="{ active: activePath === '/datav/bar_line' }" href="/datav/bar_line">
                    <p class="link-text">Bar/Line</p>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/cube_bar' }" href="/datav/cube_bar">
                    <p class="link-text">Cube Bar</p>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/circle_bar' }" href="/datav/circle_bar">
                    <p class="link-text">Circle Bar</p>
                </a>
                <a class="link" :class="{ active: activePath === '/datav/pie' }" href="/datav/pie">
                    <p class="link-text">Pie</p>
                </a>
            </section>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 200px;
    background-color: var(--bg-color);
    padding: 48px 32px;
    overflow-y: auto;
    transform: translate(-100%);
    transition: background-color 0.2s, opacity 0.25s, transform 0.5s cubic-bezier(.19, 1, .22, 1);
    background-color: #fff;
    box-shadow: -2px 6px 4px 0 rgba(0, 0, 0, 0.3);
    transition: all 0.5s cubic-bezier(.19, 1, .22, 1);
    &:hover {
        box-shadow: 0px 6px 4px 0 rgba(0, 0, 0, 0.3);
    }
}

@media screen and (min-width: 1440px) {
    .sidebar {
        padding: 48px 32px;
        width: calc(200px + 32px);
    }
}

@media screen and (min-width: 960px) {
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