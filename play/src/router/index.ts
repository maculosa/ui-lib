import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'defaultLayout',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router
