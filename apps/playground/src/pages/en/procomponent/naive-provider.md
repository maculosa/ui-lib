---
title: NaiveProvider
desc: NaiveProvider is a Naive UI Provider component that supplies the Naive UI theme configuration.
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