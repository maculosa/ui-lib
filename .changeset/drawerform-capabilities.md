---
"@banmao/procomponent": minor
---

- feat(DrawerForm): 重写抽屉表单并对齐 ModalForm 能力

  - 显隐：新增 `show` / `defaultShow`，支持受控与非受控；暴露 `open` / `close`，抛 `update:show` / `open` / `close`
  - 插槽：新增 `trigger`、`form`、`footer`、`header`、`header-extra`，默认插槽保留为 trigger 兼容回退
  - footer：新增 `hideFooter`、`confirmLoading`、`submitText` / `resetText` / `cancelText`，`footer` 插槽提供 `close` / `reset` / `submit` / `confirmLoading`
  - 提交：新增 `closeOnSubmit`，校验通过后按需自动关闭；暴露 `submit` / `reset` / `setFieldValue` / `form`
  - 数据：`model` 支持 `v-model:model`
  - 抽屉：新增 `placement`、`width`、`height`、`resizable`、`showMask`、`maskClosable`、`closeOnEsc`、`blockScroll`、`autoFocus`、`trapFocus`、`displayDirective`、`zIndex`
  - 类型：包入口导出 `DrawerFormProps`、`DrawerFormEmits`、`DrawerFormExpose`、`DrawerFormFooterScope`、`DrawerFormColumn`
  - 文档：新增 playground 中英文 DrawerForm 文档与 5 个示例，侧边栏与目录同步可用
