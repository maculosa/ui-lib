---
name: ProText
description: ProText is a text-based game where you play as a professional text editor.

---

<route lang="yaml">
meta:
  layout: default
</route>


<script setup>
    import Base from '@/examples/ProText/index.vue'
    import CopyDemo from '@/examples/ProText/copy.vue'
    import Ellipsis from '@/examples/ProText/ellipsis.vue'
</script>

# ProText

## Base
<div style="display: grid; gap: 20px; grid-template-columns: 1fr 1fr;
grid-auto-flow: row dense;
">
<Demo title="基本用法">
    <Base />
</Demo>

<Demo title="可复制">
    <CopyDemo />
</Demo>

<Demo title="超出部分省略">
    <Ellipsis />
</Demo>

<Demo title="可复制">
    <CopyDemo />
</Demo>
</div>