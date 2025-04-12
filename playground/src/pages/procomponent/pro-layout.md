---
name: ProLayout
desc: ProLayout 是一个开箱即用的管理端布局组件，支持多种配置
---

<route lang="yaml">
meta:
    layout: default
</route>

<script setup>
    import ProLayoutVertical from '@/examples/ProLayout/vertical.vue'
    import ProLayoutVerticalRaw from '@/examples/ProLayout/vertical.vue?raw'
    import ProLayoutHorizontal from '@/examples/ProLayout/horizontal.vue'
    import ProLayoutHorizontalRaw from '@/examples/ProLayout/horizontal.vue?raw'
    import ProLayoutHorizontalMix from '@/examples/ProLayout/horizontal-mix.vue'
    import ProLayoutHorizontalMixRaw from '@/examples/ProLayout/horizontal-mix.vue?raw'
    import ProLayoutVerticalMix from '@/examples/ProLayout/vertical-mix.vue'
    import ProLayoutVerticalMixRaw from '@/examples/ProLayout/vertical-mix.vue?raw'
</script>

# ProLayout

ProLayout 是一个开箱即用的管理端布局组件，支持多种配置

## Example

<Demo title="垂直布局"
    desc="Vertical Layout 垂直布局"
    :raw="ProLayoutVerticalRaw"
>
    <ProLayoutVertical />
</Demo>

<Demo title="垂直混合布局"
    desc="Vertical Mix 垂直混合布局"
    :raw="ProLayoutVerticalMixRaw"
>
    <ProLayoutVerticalMix />
</Demo>

<Demo title="水平布局"
    desc="Horizontal 水平布局"
    :raw="ProLayoutHorizontalRaw"
>
    <ProLayoutHorizontal />
</Demo>

<Demo title="水平混合布局 "
    desc="Horizontal Mix 水平混合布局"
    :raw="ProLayoutHorizontalMixRaw"
>
    <ProLayoutHorizontalMix />
</Demo>
