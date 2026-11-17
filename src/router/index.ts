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
  // 与 Vite base 保持一致，GitHub Pages 子路径下路由才能正确解析
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
