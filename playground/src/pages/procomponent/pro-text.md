---
name: ProText
description: ProText is a text-based game where you play as a professional text editor.

---

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
    import { NGrid, NGridItem } from 'naive-ui'
    import Base from '@/examples/ProText/index.vue'
    import Ellipsis from '@/examples/ProText/ellipsis.vue'
    import CopyDemo from '@/examples/ProText/copy.vue'
</script>

# ProText


<NGrid cols="2" x-gap="16">
    <NGridItem>
        <Demo title="基本用法" :raw="BaseRaw">
            <Base />
        </Demo>
        <Demo title="超出部分省略" :raw="EllipsisRaw">
            <Ellipsis />
        </Demo>
    </NGridItem>
    <NGridItem>
        <Demo title="可复制" :raw="CopyDemoRaw">
            <CopyDemo />
        </Demo>
    </NGridItem>
</NGrid>
