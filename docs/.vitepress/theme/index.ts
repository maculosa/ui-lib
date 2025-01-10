// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { setup } from '@css-render/vue3-ssr'
import './style.css'
import DemoComponent from '../vitepress/components/vp-demo.vue'
import Layout from '../vitepress/components/layout.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
    const { collect } = setup(app)
    app.provide('css-render-collect', collect)


    app.component('Demo', DemoComponent)
  }
} satisfies Theme
