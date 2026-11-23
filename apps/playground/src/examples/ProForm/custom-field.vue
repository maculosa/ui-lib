<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { NRate } from 'naive-ui'
import { h, ref, type Ref } from 'vue'

const formModel = ref({ rating: 3 })
const submitted = ref('')

const columns = ref([
  {
    title: '满意度',
    key: 'rating',
    valueType: 'custom',
    formRender: (key: string, formData: Ref<Record<string, number>>, formItemProps?: Record<string, unknown>) => h(NRate, {
      'value': formData.value[key],
      'onUpdate:value': (value: number) => (formData.value[key] = value),
      ...(formItemProps || {}),
    }),
  },
  {
    title: '评价',
    key: 'comment',
    valueType: 'textarea',
    grid: 2,
  },
])

function handleSubmit(values: Record<string, unknown>) {
  submitted.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <ProForm
      v-model:model="formModel"
      :columns="columns"
      label-placement="left"
      :label-width="88"
      :grid-cols="2"
      @submit="handleSubmit"
    />
    <pre
      v-if="submitted"
      class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5"
    >{{ submitted }}</pre>
  </div>
</template>
