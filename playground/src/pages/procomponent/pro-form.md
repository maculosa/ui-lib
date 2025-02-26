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

<script setup lang="ts">
    import { NGrid, NGridItem } from 'naive-ui'
    import BaseProForm from '@/examples/ProForm/base.vue'
</script>

### 基本用法

<NGrid :cols="2" :x-gap="16">
  <NGridItem class="flex flex-col">
    <Demo title="基本用法" :raw="BaseProFormRaw">
        <BaseProForm />
    </Demo>
    <Demo title="基本用法" :raw="BaseProFormRaw">
        <BaseProForm />
    </Demo>
  </NGridItem>
  <NGridItem>
    <Demo title="基本用法" :raw="BaseProFormRaw">
        <BaseProForm />
    </Demo>
  </NGridItem>
</NGrid>

## ProForm API

<API-Table name="ProForm" />
