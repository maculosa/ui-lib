<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NMessageProvider } from 'naive-ui'
</script>

<template>
<n-config-provider abstract inlineThemeDisabled :locale="zhCN"
  :date-locale="dateZhCN"
>
  <n-message-provider>
    <slot />
  </n-message-provider>
</n-config-provider>
</template>