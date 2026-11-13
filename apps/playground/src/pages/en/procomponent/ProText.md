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
</script>

# ProText

## Base

<NGrid cols="2" x-gap="16">
    <NGridItem>
        <Demo title="Basic usage" :raw="BaseRaw">
            <Base />
        </Demo>
        <Demo title="Ellipsis on overflow" :raw="EllipsisRaw">
            <Ellipsis />
        </Demo>
    </NGridItem>
    <NGridItem>
        <Demo title="Copyable" :raw="CopyDemoRaw">
            <CopyDemo />
        </Demo>
    </NGridItem>
</NGrid>