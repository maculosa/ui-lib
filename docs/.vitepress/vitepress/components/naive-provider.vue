<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'

</script>

<template>
<n-config-provider abstract inlineThemeDisabled>
  <n-message-provider>
    <slot />
  </n-message-provider>
</n-config-provider>
</template>