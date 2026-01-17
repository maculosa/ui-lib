<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart } from '@banmao/datav'
import {
  NColorPicker,
  NForm,
  NFormItemGi,
  NInput,
  NSpin,
  NSlider,
  NSwitch,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'

interface DataItem {
  name: string
  value: number
  phone: number
}

const data = ref<DataItem[]>([])
const loading = ref<boolean>(false)

const originData = [
  {
    name: 'Mon',
    value: 1548,
    phone: 234,
  },
  {
    name: 'Tue',
    value: 2125,
    phone: 345,
  },
  {
    name: 'Wed',
    value: 1520,
    phone: 124,
  },
  {
    name: 'Thu',
    value: 3498,
    phone: 123,
  },
  {
    name: 'Fri',
    value: 3200,
    phone: 123,
  },
  {
    name: 'Sat',
    value: 3181,
    phone: 123,
  },
  {
    name: 'Sun',
    value: 2789,
    phone: 123,
  },
].sort((a, b) => a.value - b.value)

function fetchData(): Promise<DataItem[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(originData)
    }, 300)
  })
}

onMounted(async () => {
  try {
    loading.value = true
    data.value = await fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

type FormType = {
  title: string
  barWidth: number
  vertical: boolean
  type: 'bar' | 'line'
  color: string
  colors: string[]
  isGradient: boolean
}

const formData = ref<FormType>({
  title: '柱状图',
  barWidth: 10,
  vertical: false,
  type: 'bar',
  color: '#5470c6',
  colors: ['#B1C654', '#91cc75'],
  isGradient: true,
})
</script>

<template>
  <n-form>
    <n-grid :cols="2" :x-gap="16">
      <n-form-item-gi label="Title">
        <n-input v-model:value="formData.title" />
      </n-form-item-gi>

      <n-form-item-gi label="图标类型">
        <n-radio-group v-model:value="formData.type">
          <n-radio-button value="bar">柱状图</n-radio-button>
          <n-radio-button value="line">折线图</n-radio-button>
          <n-radio-button value="scatter">散点图</n-radio-button>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi v-if="formData.type === 'bar'" label="垂直布局">
        <n-switch v-model:value="formData.vertical" />
      </n-form-item-gi>
      <n-form-item-gi v-if="formData.type === 'bar'" label="柱状图宽度">
        <n-slider v-model:value="formData.barWidth" :min="10" :max="50" />
      </n-form-item-gi>
      <n-form-item-gi label="是否为渐变颜色">
        <n-switch v-model:value="formData.isGradient" />
      </n-form-item-gi>
      <n-form-item-gi v-if="!formData.isGradient" label="柱状图颜色">
        <n-color-picker v-model:value="formData.color" />
      </n-form-item-gi>
      <n-form-item-gi v-else label="柱状图渐变颜色">
        <div style="display: flex; gap: 10px; width: 100%">
          <n-color-picker v-model:value="formData.colors[0]" />
          <n-color-picker v-model:value="formData.colors[1]" />
        </div>
      </n-form-item-gi>
    </n-grid>
  </n-form>
  <n-spin :show="loading">
    <div class="box">
      <Chart
        :title="{
          text: formData.title,
        }"
        :legend="{
          mapData: {
            value: '销售额',
            phone: '电话',
          },
        }"
        triggerType="axis"
        :barWidth="formData.barWidth"
        :xAxis="{ type: formData.vertical ? 'value' : 'category' }"
        :yAxis="{
          type: formData.vertical ? 'category' : 'value',
        }"
        :seriesType="[
          {
            type: formData.type,
            color: formData.isGradient ? formData.colors : formData.color,
          },
          {
            type: formData.type,
            color: formData.isGradient ? ['#188260', '#E9F26C'] : formData.color,
          },
        ]"
        :data="data"
      />
    </div>
  </n-spin>
</template>

<style scoped>
.box {
  width: 600px;
  height: 400px;
}
</style>
