---
name: ProTable
desc: ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

---

<route lang="yaml">
  meta:
    layout: default
</route>

<script setup>
    import BaseProTable from '@/examples/ProTable/base.vue'
    import BaseProTableRaw from '@/examples/ProTable/base.vue?raw'
    import SimpleDemo from '@/examples/ProTable/simple-demo.vue'
    import SimpleDemoRaw from '@/examples/ProTable/simple-demo.vue?raw'
</script>

## ProTable

ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

---

### Simple Usage

Simple mode is a mode that only displays the data without any additional features.

<Demo title="Simple Usage"
    :raw="SimpleDemoRaw"
>
<SimpleDemo />
</Demo>


### Base Usage

Base mode is a mode that displays the data with some basic features.

<Demo
    title="Base Usage"
    desc="Base mode is a mode that displays the data with some basic features."
    :raw="BaseProTableRaw"
>
<BaseProTable />
</Demo>
