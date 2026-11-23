<script setup lang="ts">
import { DrawerForm } from '@banmao/procomponent'
import { NButton, NSpace, NTag, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const show = ref(false)
const loading = ref(false)
const events = ref<string[]>([])

const columns = [
  {
    title: '订单号',
    key: 'orderNo',
    valueType: 'text',
    rule: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  },
  {
    title: '备注',
    key: 'remark',
    valueType: 'textarea',
  },
]

function record(event: string) {
  events.value = [`${event} · ${new Date().toLocaleTimeString()}`, ...events.value].slice(0, 4)
}

async function handleSubmit() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  show.value = false
  message.success('保存成功')
}
</script>

<template>
  <div>
    <NSpace align="center">
      <NButton type="primary" @click="show = true">打开抽屉</NButton>
      <NTag :type="show ? 'success' : 'default'" size="small">show: {{ show }}</NTag>
    </NSpace>

    <DrawerForm
      v-model:show="show"
      :show-trigger="false"
      :close-on-submit="false"
      :confirm-loading="loading"
      title="异步提交"
      :columns="columns"
      label-placement="left"
      :label-width="88"
      @submit="handleSubmit"
      @open="record('open')"
      @close="record('close')"
    />

    <ul v-if="events.length" class="mt-4 text-xs opacity-70">
      <li v-for="item in events" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
