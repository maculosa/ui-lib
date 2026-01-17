<script setup lang="ts">
import { ref } from 'vue'

const steps = ref([
  {
    title: 'Welcome to ProComponent',
    description: 'This is a tour for ProComponent',
    target: () => document.querySelector('.tour-target') as HTMLElement,
  },
  {
    title: 'ProTable',
    description: 'This is a table component',
    target: () => document.querySelector('.pro-table-target') as HTMLElement,
  },
])
</script>

<template>
  <div class="tour-target">This is a target</div>
  <Tour :steps="steps" />
</template>
