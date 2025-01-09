<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        visible: {
            type: Boolean,
            default: true
        },
        source: {
            type: String,
            default: true
        }
    })

    const decoded = computed(() => {
        return decodeURIComponent(props.source)
    })
</script>

<template>
    <div v-show="visible" class="exmaple-source-wrapper">
        <div class="example-source" v-html="decoded" />
    </div>
</template>

<style scoped lang="scss">
:deep(.language-vue) {
    margin: 0 !important;
    border-radius: 0 !important;
}
</style>
