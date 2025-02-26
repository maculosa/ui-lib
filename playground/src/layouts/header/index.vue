<script setup lang="ts">
import Logo from '../logo/index.vue'
import Nav from '../nav/index.vue'
import SwitchTheme from './switch-theme.vue'

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
