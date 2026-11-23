---
"@banmao/procomponent": minor
---

- feat(StepsForm): 新增弹窗分步表单组件与文档

  - 结构：`NModal` + `NSteps` + 每步独立 `ProForm`，切换步骤时按当前步重新挂载
  - 流程：下一步先校验当前步并标记错误步，上一步免校验，最后一步提交各步合并值
  - 数据：`v-model:model` 合并各步字段，新增 `defaultValue` 作为初始值与重置目标
  - 提交：新增 `closeOnSubmit`、`confirmLoading`，配合异步提交；`next` / `submit` 返回 `Promise<boolean>`
  - 插槽：新增 `trigger`、`default`、`step`、`footer`、`header`、`header-extra`
  - 实例：暴露 `open` / `close` / `next` / `prev` / `submit` / `reset` / `setStep` / `setFieldValue` / `current` / `forms` / `form`
  - ProForm：新增 `validate()` 与 `getValues()` 实例方法
  - 类型：包入口导出 `StepsFormProps`、`StepsFormEmits`、`StepsFormExpose`、`StepsFormFooterScope`、`StepsFormStepScope`、`StepsFormStep`、`StepsFormColumn`
  - 文档：新增 playground 中英文 StepsForm 文档与 5 个示例
