<template>
    <nav class="nav">
        <router-link v-for="item in navItems" :key="item.url" :to="item.url"
            :class="{
                active: isActive(item.url),
            }">
            {{ item.name }}
        </router-link>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import config from '@/config'

const route = useRoute()

const navItems = config.navItems

function isActive(path: string) {
    if (path === '/') {
        return route.path === '/'
    } else {
        return route.path.includes(path)
    }
}

</script>
<style lang="scss" scoped>
.nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 32px;

    a {
        color: #333;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            text-shadow: 0px 0px 2px #33333333;
        }

        &.active {
            color: #409eff;
        }
    }
}

.dark .nav {
    a {
        color: #eee;

        &.active {
            color: #409eff;
        }
    }
}
</style>
