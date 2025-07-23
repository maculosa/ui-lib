<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useClipboard } from '@vueuse/core'
import 'highlight.js/lib/common'
import 'highlight.js/styles/atom-one-dark.css'
import hljsVuePlugin from '@highlightjs/vue-plugin';
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const highlightjs = hljsVuePlugin.component;
const message = useMessage()

const { code, language = 'xml' } = defineProps<{
    code: string
    language?: string
}>()

const codeRaw = computed(() => code || '')

const { copy } = useClipboard()
const copyCode = async () => {
    await copy(codeRaw.value)
    message.success('复制成功')
}

</script>

<template>
<div class="b-t-1 b-zinc-600">
    <div class="p-4 flex justify-between items-center text-zinc-300 text-14px bg-zinc-800">
        <span>示例代码</span>
        <n-tooltip trigger="hover">
            <template #trigger>
                <Icon icon="carbon:copy" width="24" height="24" class="outline-none p-1 rounded-1 text-zinc-300 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 active:text-[#3b82f6] cursor-pointer transition-all transition-delay-200 ease" @click="copyCode" />
            </template>
            复制代码
        </n-tooltip>
    </div>
    <div class="overflow-auto max-h-150">
        <highlightjs :language="language" :code="codeRaw" class="m-0 overflow-x-auto" />
    </div>
</div>
</template>
