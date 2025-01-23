/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '~icons/bm-icon/*' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent;
    export default component;
}