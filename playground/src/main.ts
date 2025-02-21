import { createHead } from '@unhead/vue'
import routes from 'pages-generated'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Demo from './components/Demo/index.vue'

import './style.css'

import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);


const app = createApp(App)
const head = createHead()
// import config from '@/banmao.config.json'

const router = createRouter({
    history: createWebHistory(),
    routes
})


app.component('Demo', Demo)

// setupRouter(app)
app.use(hljsVuePlugin)
app.use(head)
app.use(router)

app.mount('#app')
