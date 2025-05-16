<script setup lang="ts">
defineOptions({
    name: 'LoginImage'
})

interface Props {
    /** 需要展示的图片地址 */
    src: string
}

const props = defineProps<Props>()
</script>

<template>
    <img :src="props.src" :alt="`登录界面背景图 - ${props.src}}`" loading="lazy"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] dark:grayscale-[0.4]" />
</template>
