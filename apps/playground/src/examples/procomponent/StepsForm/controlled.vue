<script setup lang="ts">
import { StepsForm } from '@banmao/procomponent'
import { NButton, NSpace, NTag } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref()
const show = ref(false)
const events = ref<string[]>([])

const steps = [
  {
    title: '选择类型',
    columns: [
      {
        title: '类型',
        key: 'type',
        valueType: 'select',
        options: [
          { label: '个人', value: 'person' },
          { label: '企业', value: 'company' },
        ],
        rule: [{ required: true, message: '请选择类型', trigger: 'change' }],
      },
    ],
  },
  {
    title: '填写资料',
    columns: [
      {
        title: '名称',
        key: 'name',
        valueType: 'text',
        rule: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      { title: '备注', key: 'remark', valueType: 'textarea' },
    ],
  },
]

function record(event: string) {
  events.value = [`${event} · ${new Date().toLocaleTimeString()}`, ...events.value].slice(0, 4)
}
</script>

<template>
  <div>
    <NSpace align="center">
      <NButton type="primary" @click="show = true">v-model:show 打开</NButton>
      <NButton @click="formRef?.open()">实例 open()</NButton>
      <NTag :type="show ? 'success' : 'default'" size="small">show: {{ show }}</NTag>
    </NSpace>

    <StepsForm
      ref="formRef"
      v-model:show="show"
      :show-trigger="false"
      title="受控显隐"
      :steps="steps"
      :width="600"
      label-placement="left"
      @open="record('open')"
      @close="record('close')"
      @step-change="(current: number, previous: number) => record(`step ${previous} → ${current}`)"
      @submit="() => record('submit')"
    />

    <ul v-if="events.length" class="mt-4 text-xs opacity-70">
      <li v-for="item in events" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
