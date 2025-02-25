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
<div class="bg-[#282c34] b-t-1 b-t-style-dashed b-b-[#e5e7eb]">
    <div class="p-4 flex justify-between items-center text-[#e5e7eb] text-14px bg-[#21252b]">
        <span>示例代码</span>
        <n-tooltip trigger="hover">
            <template #trigger>
                <Icon icon="carbon:copy" width="18" height="18" class="outline-none p-1 rounded-1 text-[#9ca3af] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 active:text-[#3b82f6] cursor-pointer transition-all transition-delay-200 ease" @click="copyCode" />
            </template>
            复制代码
        </n-tooltip>
    </div>
    <div class="p-2 overflow-auto max-h-150 bg-[#282c34]">
        <highlightjs :language="language" :code="codeRaw" class="p-4 m-0 overflow-x-auto" />
    </div>
</div>
</template>
