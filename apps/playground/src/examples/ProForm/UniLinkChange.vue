<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref, watchEffect } from 'vue'

const formRef = ref()
const formModel = ref({
  company: null,
  product: null
})

const login = (formModel: any) => {
  console.log(formModel)
}

interface SelectOption {
  label: string
  value: string
}
const productOptions = ref<SelectOption[]>([])

watchEffect(() => {
  console.log('formModel.value', formModel.value)
})

const getProductOptionsByCompany = (name: string) => {
  if (name === 'xiaomi') {
    productOptions.value = [
      { label: '小米手机', value: 'xiaomi_18' },
      { label: '小米SU7', value: 'xiaomi_car_su7' },
    ]
  } else if (name === 'apple') {
    productOptions.value =  [
      { label: 'iPhone 17 Pro Max', value: 'iphone17promax' },
      { label: 'Mac Mini', value: 'mac_mini' }
    ]
  } else {
    productOptions.value =  [
      { label: 'Huawei Mate 80 Pro', value: 'huawei_mate_80_pro' },
      { label: '问界 M9', value: 'wenjie_m9' }
    ]
  }
}

const columns = ref([
  { title: '企业', key: 'company', valueType: 'select',
    options: [
      { label: '小米', value: 'xiaomi' },
      { label: 'Apple', value: 'apple' },
      { label: '华为', value: 'huawei' }
    ],
    formItemProps: {
      onChange: (e: string) => {
        console.log('e: ', e)
        formRef.value?.setFieldValue('product', null)
        getProductOptionsByCompany(e)
      }
    }
  },
  {
    title: '产品',
    key: 'product',
    valueType: 'select',
    options: productOptions,
  },
])

const rules = ref({
  company: [{ required: true, message: '请输入企业', trigger: 'blur' }],
  product: [{ required: true, message: '请选择产品', trigger: ['change', 'blur'] }],
})
</script>

<template>
  <ProForm ref="formRef" mode="login" :columns="columns" :model="formModel" :rules="rules" @submit="login" />
</template>
