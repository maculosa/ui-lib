---
name: ProForm
desc: ProForm 是一个基于 Form 的高级表单组件，提供了表单布局、表单验证、表单提交等常用的表单功能，可以帮助开发者快速构建表单界面。

---

<route lang="yaml">
meta:
  layout: default
</route>

# ProForm

ProForm 是一个基于 Form 的高级表单组件，提供了表单布局、表单验证、表单提交等常用的表单功能，可以帮助开发者快速构建表单界面。

## 何时使用
- 当你需要快速开发表单页面
- 当你需要更加可配置化的表单

## 代码示例
以下是 ProForm 的代码示例：


<Demo title="筛选重置"
  desc="筛选重置"
 :raw="FilterResetRaw"
>
<FilterReset />
</Demo>



<Demo title="筛选重置默认值"
  desc="筛选重置默认值"
 :raw="FilterResetWithDefaultRaw"
>
<FilterResetWithDefault />
</Demo>


<Demo title="基本用法"
  desc="基本用法"
 :raw="BaseRaw"
>
<Base />
</Demo>

<Demo title="请求级联选择器"
  desc="请求级联选择器"
 :raw="RequestCascaderFormRaw"
>
<RequestCascaderForm />
</Demo>




## ProForm API
