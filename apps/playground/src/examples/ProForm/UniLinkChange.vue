<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

const formRef = ref()
const formModel = ref({
  company: null,
  product: null,
})
const submitted = ref('')

interface SelectOption {
  label: string
  value: string
}
const productOptions = ref<SelectOption[]>([])

function getProductOptionsByCompany(name: string | null) {
  if (name === 'xiaomi') {
    productOptions.value = [
      { label: '小米手机', value: 'xiaomi_18' },
      { label: '小米SU7', value: 'xiaomi_car_su7' },
    ]
  }
  else if (name === 'apple') {
    productOptions.value = [
      { label: 'iPhone 17 Pro Max', value: 'iphone17promax' },
      { label: 'Mac Mini', value: 'mac_mini' },
    ]
  }
  else {
    productOptions.value = [
      { label: 'Huawei Mate 80 Pro', value: 'huawei_mate_80_pro' },
      { label: '问界 M9', value: 'wenjie_m9' },
    ]
  }
}

const columns = ref([
  {
    title: '企业',
    key: 'company',
    valueType: 'select',
    options: [
      { label: '小米', value: 'xiaomi' },
      { label: 'Apple', value: 'apple' },
      { label: '华为', value: 'huawei' },
    ],
    formItemProps: {
      'onUpdate:value': (value: string) => {
        formRef.value?.setFieldValue('product', null)
        getProductOptionsByCompany(value)
      },
    },
  },
  {
    title: '产品',
    key: 'product',
    valueType: 'select',
    options: productOptions,
  },
])

const rules = ref({
  company: [{ required: true, message: '请选择企业', trigger: ['change', 'blur'] }],
  product: [{ required: true, message: '请选择产品', trigger: ['change', 'blur'] }],
})

function handleSubmit(values: Record<string, unknown>) {
  submitted.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <ProForm
      ref="formRef"
      :columns="columns"
      :model="formModel"
      :rules="rules"
      label-placement="left"
      :label-width="80"
      :grid-cols="2"
      @submit="handleSubmit"
    />
    <pre
      v-if="submitted"
      class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5"
    >{{ submitted }}</pre>
  </div>
</template>
