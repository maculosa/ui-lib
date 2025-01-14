import { createHead } from '@unhead/vue'
import routes from 'pages-generated'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Demo from './components/Demo/index.vue'

import './style.css'



// import 'highlight.js/styles/github-dark-dimmed.css'

// import setupRouter from './router'
// import 'prismjs'
// import 'prismjs/components/prism-bash'
// import 'prismjs/components/prism-typescript'
// import 'prismjs/components/prism-javascript'
// import 'prismjs/components/prism-markup'
// import 'prismjs/components/prism-markup-templating'
// import 'prismjs/components/prism-rust'
// import 'prismjs/components/prism-go'

// import 'prismjs/themes/prism-tomorrow.css'

const app = createApp(App)
const head = createHead()
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/basicLayout.vue'),
            children: routes
        }
    ]
})


app.component('Demo', Demo)

// setupRouter(app)
app.use(head)
app.use(router)

app.mount('#app')
