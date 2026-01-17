<script setup lang="ts">
import { defineComponent, h, inject } from 'vue';
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import NaiveProvider from './naive-provider.vue';

const { Layout } = DefaultTheme

const CssRenderStyle = defineComponent({
  setup() {
    const collect = inject('css-render-collect') as () => any
    return {
      style: collect()
    }
  },
  render() {
    return h('css-render-style', {
      innerHTML: this.style
    })
  }
})

const VitepressPath = defineComponent({
  setup() {
    const route = useRoute()
    return () => {
      return h('vitepress-path', null, [route.path])
    }
  }
})


</script>

<template>
    <NaiveProvider>
        <Layout>
            <slot />
        </Layout>
        <CssRenderStyle />
        <VitepressPath />
    </NaiveProvider>
</template>