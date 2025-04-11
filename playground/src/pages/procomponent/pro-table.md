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
    import NoSearchBar from '@/examples/ProTable/no-searchbar.vue'
    import NoSearchBarRaw from '@/examples/ProTable/no-searchbar.vue?raw'
    import SimpleDemo from '@/examples/ProTable/simple-demo.vue'
    import SimpleDemoRaw from '@/examples/ProTable/simple-demo.vue?raw'
    import FixedHeight from '@/examples/ProTable/fixed-height.vue'
    import FixedHeightRaw from '@/examples/ProTable/fixed-height.vue?raw'
    import UseTooltipInColumns from '@/examples/ProTable/use-tooltip-in-columns.vue'
    import UseTooltipInColumnsRaw from '@/examples/ProTable/use-tooltip-in-columns.vue?raw'
    import SearchGrid from '@/examples/ProTable/search-grid.vue'
    import SearchGridRaw from '@/examples/ProTable/search-grid.vue?raw'
</script>

# ProTable

ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。


## Examples

下边展示的一些示例。

<Demo title="Simple Demo"
    desc="Simple mode is a mode that only displays the data without any additional features."
    :raw="SimpleDemoRaw"
>
<SimpleDemo />
</Demo>

<Demo
    title="Base Demo"
    desc="Base mode is a mode that displays the data with some basic features."
    :raw="BaseProTableRaw"
>
<BaseProTable />
</Demo>

<Demo
    title="No Search Demo"
    desc="No search is a mode that displays the data without search."
    :raw="NoSearchBarRaw"
>
<NoSearchBar />
</Demo>

<Demo
    title="Fixed Height"
    desc="Fixed height is a mode that displays the data with a fixed height."
    :raw="FixedHeightRaw"
>
<FixedHeight />
</Demo>

<Demo
    title="Use Tooltip in Columns Demo"
    desc="Use tooltip in columns is a mode that displays the data with a tooltip in columns."
    :raw="UseTooltipInColumnsRaw"
>
<UseTooltipInColumns />
</Demo>

<Demo
    title="Search Grid Demo"
    desc="Search grid is a mode that displays the data with a search grid."
    :raw="SearchGridRaw"
>
<SearchGrid />
</Demo>
