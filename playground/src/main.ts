import { createHead } from '@unhead/vue'
import { createApp } from 'vue'
import { setupRouter } from './router'
import App from './App.vue'
import Demo from './components/Demo/index.vue'

// import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'virtual:uno.css'

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);


const app = createApp(App)
const head = createHead()
// import config from '@/banmao.config.json'

app.component('Demo', Demo)

app.use(hljsVuePlugin)
app.use(head)

setupRouter(app)
app.mount('#app')
