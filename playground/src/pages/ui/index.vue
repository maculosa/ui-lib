<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { Button } from 'vite-lib'
import Demo from '@/components/Demo/index.vue'

</script>

<template>
  <Demo title="基础">
    <Button>Default</Button>
    <Button type="primary">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="warning">Warning</Button>
    <Button type="danger">Danger</Button>
  </Demo>

  <Demo title="尺寸">
    <Button size="mini">mini</Button>
    <Button size="small">small</Button>
    <Button size="medium">medium</Button>
    <Button size="large">large</Button>
  </Demo>
</template>

<style scoped></style>
