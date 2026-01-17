<script setup lang="ts">
defineOptions({
    name: 'Logo'
})
</script>

<template>
    <div class="logo">
        <img src="https://images.unsplash.com/photo-1745750747015-ebb15e1cc979?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D" alt="logo">
    </div>
</template>

<style scoped>
.logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    box-shadow: 0 0px 1px 0px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}
</style>