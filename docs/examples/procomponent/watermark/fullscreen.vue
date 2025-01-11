<script setup lang="ts">
import { Watermark } from '@banmao/procomponent'
import { ref } from 'vue'
import { NSwitch } from 'naive-ui'

const fullscreen = ref(false)

</script>

<template>
  <NSwitch v-model:value="fullscreen"></NSwitch>
  <Watermark :fullscreen="fullscreen" color="rgba(0, 0, 0, 0.05)" text="banmao">
    <div style="height: 100px; background-color: #fff"></div>
  </Watermark>
</template>
