<script setup lang="ts">
import { computed, ref } from 'vue'
import { NCard, NTabs, NTabPane } from 'naive-ui'

const props = defineProps<{
  title: string
  description?: string
  raw: string
}>()

const activeTab = ref('preview')
// const showCode = ref(false)

const formattedCode = computed(() => {
  return props.raw.trim()
})
</script>

<template>
  <NCard class="demo-card">
    <template #header>
      <div class="demo-card-header">
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
    </template>

    <NTabs v-model:value="activeTab" type="segment">
      <NTabPane name="preview" tab="预览">
        <slot />
      </NTabPane>
      <NTabPane name="code" tab="代码">
        <pre class="language-vue"><code>{{ formattedCode }}</code></pre>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>
.demo-card {
  margin: 16px 0;
}

.demo-card-header {
  h3 {
    margin: 0;
    font-size: 16px;
  }
  p {
    margin: 8px 0 0;
    font-size: 14px;
    color: #666;
  }
}
</style>
