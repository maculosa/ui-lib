<template>
    <div class="logo">
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
