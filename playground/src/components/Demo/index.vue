<template>
  <div class="demo-warp">
    <div class="demo-warp-header">
      <span class="demo-title">{{ title }}</span>
      <span class="demo-desc">{{ desc }}</span>
    </div>
    <div class="demo-warp-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

export interface DemoProps {
  title: string
  desc?: string
}

const props = defineProps<DemoProps>()

const { title, desc } = toRefs(props)

</script>

<style scoped lang="scss">
.demo-warp {
  margin-top: 16px;
  background-color: transparent;
  color: #333;

  &-header {
    padding: 12px 0;
    box-sizing: border-box;
    display: flex;
    justify-content: left;
  }

  &-content {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    padding: 12px 10px;
    box-sizing: border-box;
  }
}

.demo-title {
  display: block;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  color: #ccc;
}

.demo-desc {
  font-size: 12px;
  color: #888;
}
</style>
