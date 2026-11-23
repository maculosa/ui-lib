---
"@banmao/procomponent": minor
---

- feat(ModalForm): 补齐弹窗表单能力与文档

  - 显隐：新增 `show` / `defaultShow`，支持受控与非受控；暴露 `open` / `close`，抛 `update:show` / `open` / `close`
  - 插槽：新增 `trigger`、`form`、`footer`、`header`、`header-extra`，默认插槽保留为 trigger 兼容回退
  - footer：新增 `hideFooter`、`confirmLoading`、`submitText` / `resetText` / `cancelText`，`footer` 插槽提供 `close` / `reset` / `submit` / `confirmLoading`
  - 提交：新增 `closeOnSubmit`，校验通过后按需自动关闭，提交失败不再静默吞掉
  - 数据：`model` 支持 `v-model:model`，新增 `defaultValue`
  - 透传：新增 `closable`、`maskClosable`、`closeOnEsc`、`blockScroll`、`autoFocus`、`trapFocus`、`displayDirective`、`zIndex`、`draggable`
  - 实例：暴露 `open` / `close` / `submit` / `reset` / `setFieldValue` / `form`
  - 类型：包入口导出 `ModalFormProps`、`ModalFormEmits`、`ModalFormExpose`、`ModalFormFooterScope`、`ModalFormColumn`
  - 文档：新增 playground 中英文 ModalForm 文档与 5 个示例