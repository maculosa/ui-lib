<script setup lang="ts">
import { StepsForm } from '@banmao/procomponent'
import { NAlert, NFormItem, NInput, NSelect, NSpace, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const submitted = ref('')

const steps = [
  { title: '选择方案', description: '自定义控件', columns: [] },
  { title: '补充说明', description: 'step 插槽渲染', columns: [] },
]

const planOptions = [
  { label: '标准版', value: 'standard' },
  { label: '专业版', value: 'pro' },
]

function handleSubmit(values: Record<string, any>) {
  submitted.value = JSON.stringify(values, null, 2)
  message.success('提交成功')
}
</script>

<template>
  <div>
    <StepsForm
      title="step 插槽"
      :steps="steps"
      :width="600"
      label-placement="left"
      @submit="handleSubmit"
    >
      <template #step="{ index, values, setFieldValue }">
        <NSpace v-if="index === 0" vertical :size="12">
          <NAlert type="info" :bordered="false">
            step 插槽会接管所有步骤的表单，校验与字段渲染都由你负责。
          </NAlert>
          <NFormItem label="方案" required>
            <NSelect
              :value="values.plan"
              :options="planOptions"
              placeholder="请选择方案"
              @update:value="value => setFieldValue('plan', value)"
            />
          </NFormItem>
        </NSpace>

        <NFormItem v-else label="备注">
          <NInput
            :value="values.remark"
            type="textarea"
            placeholder="在这里补充说明"
            @update:value="value => setFieldValue('remark', value)"
          />
        </NFormItem>
      </template>
    </StepsForm>

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ submitted || '提交值来自 step 插槽写入的数据' }}</pre>
  </div>
</template>
