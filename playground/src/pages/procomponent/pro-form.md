---
name: ProForm
desc: ProForm 是一个基于 Form 的高级表单组件，提供了表单布局、表单验证、表单提交等常用的表单功能，可以帮助开发者快速构建表单界面。

---

<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
    import { NGrid, NGridItem } from 'naive-ui'
    import BaseProForm from '@/examples/ProForm/base.vue'
    import BaseProFormRaw from '@/examples/ProForm/base.vue?raw'
</script>

<NGrid :cols="2">
<NGridItem>
<Demo title="基本用法" :raw="BaseProFormRaw">
    <BaseProForm />
</Demo>
</NGridItem>
</NGrid>
