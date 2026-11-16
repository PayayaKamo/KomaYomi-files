import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/store' },
  { path: '/store', name: 'store', component: () => import('../pages/StorePage.vue') },
  { path: '/guide', name: 'guide', component: () => import('../pages/GuidePage.vue') },
  {
    path: '/titles/:slug',
    name: 'title',
    component: () => import('../pages/TitleDetailPage.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/store' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
