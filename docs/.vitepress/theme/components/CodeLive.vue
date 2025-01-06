<template>
    <div class="code-live">
        <div class="code-live-header">
            <div class="code-live-header-title">{{ title }}</div>
            <div class="code-live-header-desc">{{ desc }}</div>
        </div>
        <div class="code-live-body">
            <div class="code-live-body-demo">
                <div class="code-live-body-demo-title">示例</div>
                <div class="code-live-body-demo-content">
                    <div class="code-live-body-demo-content-demo">
                        <slot></slot>
                    </div>
                </div>
            </div>
            <div class="code-live-body-code">
                <div class="code-live-body-code-title">代码</div>
                <div class="code-live-body-code-content">
                    <div class="code-live-body-code-content-code">
                        <pre><code class="language-tsx">{{ code }}</code></pre>
                    </div>
                </div>
           </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getStaticFile } from '../utils/getStaticFile';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    demo: {
        type: String,
        default: ''
    }
})

const code = computed(() => {
    return getStaticFile(props.demo)
})


</script>