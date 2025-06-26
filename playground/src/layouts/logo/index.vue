<template>
    <div class="bm-logo">
        <div class="logo-pic"></div>
        <div class="logo-text">{{ logoText }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()

const logoText = ref('Data V')

watchEffect(() => {
    if (route.path === '/ui') {
        logoText.value = 'UI'
    } else {
        logoText.value = 'Data V'
    }
})
</script>

<style scoped>
.bm-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

}

.logo-pic {
    width: 40px;
    height: 40px;
    border-radius: 20%;
    @apply bg-primary dark:bg-[#409EFF]/10;
}

.logo-text {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}
</style>