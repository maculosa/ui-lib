<script setup lang="ts">
import { DrawerForm } from '@banmao/procomponent'
import { ref } from 'vue'

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    rule: [{ required: true, message: '请输入姓名' }],
  },
  {
    title: '年龄',
    key: 'age',
    valueType: 'digit',
    hideInForm: true,
    formItemProps: { min: 0 },
    rule: [{ required: true, message: '请输入年龄' }],
  },
])
</script>

<template>
  <DrawerForm :columns="columns" title="DrawerForm" :width="502" />
</template>
