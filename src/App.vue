<script setup lang="ts">
/**
 * App 壳层 —— 沿用苹果 App Store 布局策略：
 *  - ≥484px：左侧栏常驻 260px（iPad 竖屏/横屏、桌面全部保留）
 *    用户可手动收起为 70px 图标轨道（窄屏 PC/平板场景），偏好持久化到 localStorage
 *  - <484px：侧栏收起，顶部汉堡菜单（由 SidebarNav 内部处理）
 *  - 内容区不设横向 padding，各 shelf / 页面头自己吃 --body-gutter
 */
import { ref } from 'vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import SiteFooter from './components/layout/SiteFooter.vue'

/** 侧栏是否手动收起（仅 ≥484px 生效） */
const sidebarCollapsed = ref(false)

// 读取上次偏好（SSR 安全：localStorage 不存在时默认展开）
try {
  sidebarCollapsed.value = localStorage.getItem('komayomi_store_sidebar_collapsed') === '1'
} catch {
  sidebarCollapsed.value = false
}

function updateSidebarCollapsed(collapsed: boolean) {
  sidebarCollapsed.value = collapsed
  try {
    localStorage.setItem('komayomi_store_sidebar_collapsed', collapsed ? '1' : '0')
  } catch {
    // 持久化失败不影响本次切换
  }
}
</script>

<template>
  <div class="layout">
    <SidebarNav
      :collapsed="sidebarCollapsed"
      @update:collapsed="updateSidebarCollapsed"
    />
    <main class="content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <RouterView />
      <SiteFooter />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

@media (min-width: 484px) {
  .content {
    margin-left: var(--sidebar-width);
    transition: margin-left 0.2s ease;
  }
  .content.sidebar-collapsed {
    margin-left: var(--sidebar-collapsed-width);
  }
}

/* 手机端为顶部栏留出空间（顶栏高约 52px，由 SidebarNav 渲染） */
@media (max-width: 483px) {
  .content {
    padding-top: 52px;
  }
}
</style>
