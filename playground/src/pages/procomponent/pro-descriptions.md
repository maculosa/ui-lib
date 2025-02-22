---
name: ProDescriptions
desc: ProDescriptions 是一个基于 Descriptions 的高级描述组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

---

<route lang="yaml">
meta:
  layout: default
</route>

[[toc]]

<script setup lang="ts">
    import BaseProDescriptions from '@/examples/ProDescriptions/base.vue'
    import BaseProDescriptionsRaw from '@/examples/ProDescriptions/base.vue?raw'
</script>

## ProDescriptions
ProDescriptions 是一个基于 Descriptions 的高级描述组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

### Simple Usage

<Demo title="Simple Usage" :raw="BaseProDescriptionsRaw">
    <BaseProDescriptions />
</Demo>
