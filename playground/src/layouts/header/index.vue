<script setup lang="ts">
import Logo from '@/components/layout/logo/index.vue'
import Nav from '@/components/layout/nav/index.vue'
import SwitchTheme from '@/components/SwitchTheme.vue'

</script>
<template>
    <header class="layout-header">
      <Logo />
      <div class="flex items-center gap-4">
        <Nav />
        <SwitchTheme />
      </div>
    </header>
</template>
