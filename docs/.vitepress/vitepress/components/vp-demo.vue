<script lang="ts" setup>
import { computed, getCurrentInstance, toRef } from 'vue';
import { useClipboard, useToggle } from '@vueuse/core';
import { useSourceCode } from '../composables/source-code';
import SourceCode from './demo/vp-code-source.vue'
import { NButton } from 'naive-ui';

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

// const sourceCodeRef = ref()

const decodedDescription = computed(() => decodeURIComponent(props.description))



</script>

<template>
    <div v-html="decodedDescription"></div>
    
    <div class="demo">
        <div class="example-showcase">
            <slot name="source" />
        </div>
        <div class="toolbar">
            <NButton size="small" text @click="() => copy()">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
		<path d="M9 15c0-2.828 0-4.243.879-5.121C10.757 9 12.172 9 15 9h1c2.828 0 4.243 0 5.121.879C22 10.757 22 12.172 22 15v1c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1c-2.828 0-4.243 0-5.121-.879C9 20.243 9 18.828 9 16z" />
		<path d="M17 9c-.003-2.957-.047-4.489-.908-5.538a4 4 0 0 0-.554-.554C14.43 2 12.788 2 9.5 2c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 4.57 2 6.212 2 9.5c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.05.86 2.58.906 5.538.908" />
	</g>
</svg>
                </template>
            </NButton>
            <NButton size="small" text @click="() => toggleSourceVisible()">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 8l1.84 1.85c.773.778 1.16 1.167 1.16 1.65s-.387.872-1.16 1.65L17 15M7 8L5.16 9.85C4.387 10.628 4 11.017 4 11.5s.387.872 1.16 1.65L7 15m7.5-11l-5 16" color="currentColor" />
</svg>
                </template>
            </NButton>
        </div>
        <SourceCode :visible="sourceVisible" :source="source" />
    </div>
</template>

<style lang="scss" scoped>
.demo {
    border: 1px solid #ccc;
    border-radius: 3px;

    .example-showcase {
        padding: 1.5rem;
        margin: 0.5px;
        background-color: #fff;
    }
    .toolbar {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 2.5rem;
        gap: 10px;
        
        & + * {
            margin-top: 10px;
        }
    }
}
</style>
