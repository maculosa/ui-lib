<script setup lang="ts">
import { useAsyncData } from '@banmao/hooks'
import { NAlert, NButton, NEmpty, NSpace } from 'naive-ui'
import { ref } from 'vue'

function fetchProfile(fail: boolean): Promise<{ name: string; role: string }> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (fail) reject(new Error('服务端返回 500，请稍后重试'))
      else resolve({ name: '张三', role: '组件库维护者' })
    }, 600),
  )
}

const shouldFail = ref(false)

// immediate: false —— 挂载时不发请求，由按钮手动触发
const { data, loading, error, fetchData } = useAsyncData(() => fetchProfile(shouldFail.value), {
  immediate: false,
})

function run(fail: boolean) {
  shouldFail.value = fail
  fetchData()
}
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NButton size="small" type="primary" :loading="loading" @click="run(false)">手动请求成功</NButton>
      <NButton size="small" :loading="loading" @click="run(true)">手动请求失败</NButton>
      <span class="hint">loading = {{ loading }}</span>
    </NSpace>

    <NAlert v-if="error" type="error" :title="(error as Error).message" />
    <NEmpty v-else-if="!data" description="尚未发起请求" size="small" />
    <pre v-else class="code">{{ data }}</pre>
  </NSpace>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}

.code {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  font-size: 12px;
}
</style>
