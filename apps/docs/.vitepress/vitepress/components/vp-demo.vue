<script lang="ts" setup>
import { computed, getCurrentInstance, ref, toRef } from 'vue';
import { isClient, useClipboard, useToggle } from '@vueuse/core';
import { useSourceCode } from '../composables/source-code';
import { usePlayground } from '../composables/use-playground';
import SourceCode from './demo/vp-code-source.vue'
import { NButton } from 'naive-ui';
import IconCopy from '../icons/copy.vue'
import IconCode from '../icons/code.vue'
import IconPlayground from '../icons/playground.vue'
import { useMessage } from 'naive-ui'

interface Props {
    source: string
    path: string
    rawSource: string
    description: string
}

const props = defineProps<Props>()

const vm = getCurrentInstance()

const { copy, isSupported } = useClipboard({
    source: decodeURIComponent(props.rawSource),
    read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle(false)

const demoSourceUrl = useSourceCode(toRef(props, 'path'))

const sourceCodeRef = ref<HTMLButtonElement>()

const decodedDescription = computed(() => decodeURIComponent(props.description))

const onPlaygroundClick = () => {
    const { link } = usePlayground(props.rawSource)
    if (!isClient ) return
    window.open(link)
}

// const onSourceVisibleKeydown = (e: KeyboardEvent) => {
//     if (e.key === 'Enter' || e.key === 'NumpadEnter' || e.key === 'Space') {
//         e.preventDefault()
//         toggleSourceVisible(false)
//         sourceCodeRef.value?.focus()
//     }
// }

const message = useMessage()
const copyCode = async () => {
    if (!isSupported) {
        message.error('您的浏览器不支持复制')
    }

    try {
        await copy()
        message.success('复制成功')
    } catch (error) {
        message.error('复制失败')
    }
}

</script>

<template>
    <div v-html="decodedDescription"></div>
    
    <div class="demo">
        <div class="example-showcase">
            <slot name="source" />
        </div>
        <div class="toolbar">
            <button type="button" v-show="false" @click="onPlaygroundClick"
                @keydown.prevent.enter="onPlaygroundClick"
                @keydown.prevent.space="onPlaygroundClick"   
            >
                <IconPlayground />
            </button>
            <button v-show="false" @click="copyCode">
                <IconCopy />
            </button>
            <button @click="toggleSourceVisible()">
                <IconCode />
            </button>
        </div>
        <SourceCode :visible="sourceVisible" :source="source" />
    </div>
</template>

<style lang="scss">
.demo {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;

    .example-showcase {
        padding: 1.5rem;
        margin: 0.5px;
        background-color: transparent;
    }
    .toolbar {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 2.5rem;
        gap: 10px;
        border-top: 1px solid #ccc;
        background: #f7f7f7;
        
        & + * {
            border-top: 1px solid #ccc;
        }
    }
}

@media (prefers-color-scheme: light) {
    .demo {
        .toolbar {
            background: hsl(0 0% 20%);
            color: #fff;
        }
    }
}

.example-showcase table {
    display: block !important;
    margin: 0!important;
}
</style>
