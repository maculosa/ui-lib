<template>
    <nav class="nav">
        <router-link v-for="item in navItems" :key="item.url" :to="item.url"
            :class="{ active: route.path === item.url }">
            {{ item.name }}
        </router-link>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import config from '../../../banmao.config.json'

const route = useRoute()

const navItems = config.navItems



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
            color: #ff8821;
            text-shadow: 0px 0px 2px #33333333;
        }

        &.active {
            color: #ff8821;
        }
    }
}
</style>
