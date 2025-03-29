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
    import NoSearchBar from '@/examples/ProTable/no-searchbar.vue'
    import SimpleDemo from '@/examples/ProTable/simple-demo.vue'
    import FixedHeight from '@/examples/ProTable/fixed-height.vue'
    import UseTooltipInColumns from '@/examples/ProTable/use-tooltip-in-columns.vue'
</script>

# ProTable

ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。


## Examples

### Simple Usage

<Demo title="Simple Demo"
    desc="Simple mode is a mode that only displays the data without any additional features."
    :raw="SimpleDemoRaw"
>
<SimpleDemo />
</Demo>


### Base Usage

Base mode is a mode that displays the data with some basic features.

<Demo
    title="Base Demo"
    desc="Base mode is a mode that displays the data with some basic features."
    :raw="BaseProTableRaw"
>
<BaseProTable />
</Demo>

### No Search
No search is a mode that displays the data without search.
<Demo
    title="No Search Demo"
    desc="No search is a mode that displays the data without search."
    :raw="NoSearchBarRaw"
>
<NoSearchBar />
</Demo>

### Fixed Height
Fixed height is a mode that displays the data with a fixed height.
<Demo
    title="Fixed Height Demo"
    desc="Fixed height is a mode that displays the data with a fixed height."
    :raw="FixedHeightRaw"
>
<FixedHeight />
</Demo>

### Use Tooltip in Columns
Use tooltip in columns is a mode that displays the data with a tooltip in columns.
<Demo
    title="Use Tooltip in Columns Demo"
    desc="Use tooltip in columns is a mode that displays the data with a tooltip in columns."
    :raw="UseTooltipInColumnsRaw"
>
<UseTooltipInColumns />
</Demo>

