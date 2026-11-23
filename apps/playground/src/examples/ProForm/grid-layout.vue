<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { NRadioButton, NRadioGroup } from 'naive-ui'
import { ref } from 'vue'

const gridCols = ref(3)

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    tooltip: '创建后可由管理员修改',
  },
  { title: '年龄', key: 'age', valueType: 'digit' },
  {
    title: '性别',
    key: 'gender',
    valueType: 'radio',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  { title: '生日', key: 'birthday', valueType: 'date' },
  {
    title: '城市',
    key: 'city',
    valueType: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
  { title: '备注', key: 'remark', valueType: 'textarea', grid: 3 },
])
</script>

<template>
  <div>
    <div class="mb-4 flex items-center gap-3 text-sm">
      <span class="opacity-70">grid-cols</span>
      <NRadioGroup v-model:value="gridCols">
        <NRadioButton :value="1">1</NRadioButton>
        <NRadioButton :value="2">2</NRadioButton>
        <NRadioButton :value="3">3</NRadioButton>
      </NRadioGroup>
    </div>
    <ProForm
      :columns="columns"
      :grid-cols="gridCols"
      label-placement="left"
      :label-width="88"
    />
  </div>
</template>
