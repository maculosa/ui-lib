---
title: NaiveProvider
desc: NaiveProvider 是一个 Naive UI 的 Provider 组件，用于提供 Naive UI 的主题配置。
---

<route lang="yaml">
meta:
  layout: default
</route>

# NaiveProvider



<script setup>
    import { defineComponent } from 'vue'
    import NaiveProviderRaw from '@/examples/Provider/NaiveProvider.vue?raw'

    import 'highlight.js/lib/common';
    import hljsVuePlugin from "@highlightjs/vue-plugin";

    defineComponent({
        components: {
            highlightjs: hljsVuePlugin.component
        }
    })
    // highlight(NaiveProvider)
</script>

<!-- {{ NaiveProvider }} -->

<highlightjs language="xml" :code="NaiveProviderRaw" />
