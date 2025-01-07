<script setup lang="ts">
import { NaiveProvider } from '@banmao/procomponent';
import { NConfigProvider } from 'naive-ui';
</script>

<template>
  <n-config-provider>
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>