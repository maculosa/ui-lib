<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Chart } from 'datav';
import { NColorPicker, NForm, NFormItem, NInput, NSpin, NSlider, NSwitch, NRadioGroup, NRadioButton } from 'naive-ui';

const data = ref<any[]>([])
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

function fetchData(): Promise<any[]> {
  return new Promise((resolve) => {
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
  title: string,
  barWidth: number,
  vertical: boolean,
  type: 'bar' | 'line',
  color: string,
  colors: string[],
  isGradient: boolean,
}

const formData = ref<FormType>({
  title: '柱状图',
  barWidth: 10,
  vertical: false,
  type: 'bar',
  color: '#5470c6',
  colors: [
    '#B1C654',
    '#91cc75',
  ],
  isGradient: true
})


</script>

<template>
  <n-form>
    <n-form-item label="Title">
      <n-input v-model:value="formData.title" />
    </n-form-item>

    <n-form-item label="图标类型">
      <n-radio-group v-model:value="formData.type">
        <n-radio-button value="bar">柱状图</n-radio-button>
        <n-radio-button value="line">折线图</n-radio-button>
        <n-radio-button value="scatter">散点图</n-radio-button>
      </n-radio-group>
    </n-form-item>
    <n-form-item v-if="formData.type === 'bar'" label="垂直布局">
      <n-switch v-model:value="formData.vertical" />
    </n-form-item>
    <n-form-item v-if="formData.type === 'bar'" label="柱状图宽度">
      <n-slider v-model:value="formData.barWidth" :min="10" :max="50" />
    </n-form-item>
    <n-form-item label="是否为渐变颜色">
      <n-switch v-model:value="formData.isGradient" />
    </n-form-item>
    <n-form-item v-if="!formData.isGradient" label="柱状图颜色">
      <n-color-picker v-model:value="formData.color" />
    </n-form-item>
    <n-form-item v-else label="柱状图渐变颜色">
      <div style="display: flex; gap: 10px; width: 100%;">
        <n-color-picker v-model:value="formData.colors[0]" />
        <n-color-picker v-model:value="formData.colors[1]" />
      </div>
    </n-form-item>
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
                }
            }"
            triggerType="axis"
            :barWidth="formData.barWidth"
            :option="{
                dataset: {
                    source: data,
                },
                xAxis: { type: formData.vertical ? 'value' : 'category' },
                yAxis: [{
                    type: formData.vertical ? 'category' : 'value',
                }],
                series: [
                    {
                        type: formData.type,
                        barWidth: formData.barWidth,
                        color: formData.colors[0],
                    },
                    {
                        type: formData.type,
                        barWidth: formData.barWidth,
                        id: 2
                    }
                ]
            }"        
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
