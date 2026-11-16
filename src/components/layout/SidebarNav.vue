<script setup lang="ts">
/**
 * 侧边栏 —— 沿用苹果 Navigation 组件结构：
 *  - ≥484px：常驻左栏（logo + 搜索 + 导航项，图标 24px 蓝色 keyColor）
 *  - <484px：顶部栏（汉堡菜单 + logo），点汉堡弹出全屏菜单
 *  - 搜索框：输入关键字回车 → 跳转 /store?q=xxx 由作品货架过滤
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { siteName } from '../../data/titles'

/**
 * props/emit：侧栏收起状态由 App.vue 持有（内容区 margin 需同步），
 * 偏好由 App.vue 持久化到 localStorage。
 */
defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()
function setCollapsed(value: boolean) {
  emit('update:collapsed', value)
}

const router = useRouter()
const searchQuery = ref('')
const items = [
  { to: '/store', label: '作品商店', icon: 'store' },
  { to: '/guide', label: '使用指南', icon: 'guide' },
]

const menuOpen = ref(false)

function submitSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  router.push({ path: '/store', query: { q } })
  menuOpen.value = false
}
</script>

<template>
  <!-- 常驻侧栏（≥484px），可手动收起为图标轨道 -->
  <aside class="sidebar" :class="{ collapsed }">
    <div class="logo-row">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 5.5c2.5-.8 5-.8 8 1v13c-3-1.8-5.5-1.8-8-1z" />
        <path d="M20 5.5c-2.5-.8-5-.8-8 1v13c3-1.8 5.5-1.8 8-1z" />
        <path d="M12 6.5v13" />
      </svg>
      <span class="logo-text">{{ siteName }}</span>
    </div>

    <!-- 展开态：搜索框 -->
    <div v-if="!collapsed" class="search">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索作品、作者、标签"
        @keyup.enter="submitSearch"
      />
    </div>

    <!-- 收起态：搜索图标按钮（点击先展开侧栏） -->
    <button
      v-else
      class="rail-search-btn"
      type="button"
      title="展开并搜索"
      aria-label="展开并搜索"
      @click="setCollapsed(false)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </svg>
    </button>

    <nav class="nav">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="active"
        :title="item.label"
      >
        <span class="nav-icon">
          <!-- 作品商店：购物袋 -->
          <svg v-if="item.icon === 'store'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.5 9h15l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3L4.5 9Z" />
            <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
          </svg>
          <!-- 使用指南：打开的书 -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
            <path d="M12 6.5C10.5 5 8 4 5 4v14c3 0 5.5 1 7 2.5" />
            <path d="M12 6.5C13.5 5 16 4 19 4v14c-3 0-5.5 1-7 2.5" />
            <path d="M12 6.5v14" stroke-width="1.6" />
          </svg>
        </span>
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- 底部：收起/展开切换 -->
    <div class="sidebar-footer">
      <button
        class="collapse-toggle"
        type="button"
        :title="collapsed ? '展开侧栏' : '收起侧栏'"
        :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="setCollapsed(!collapsed)"
      >
        <svg
          class="toggle-chevron"
          :class="{ 'point-right': collapsed }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <span v-if="!collapsed" class="toggle-text">收起</span>
      </button>
    </div>
  </aside>

  <!-- 顶部栏（<484px） -->
  <div class="topbar">
    <button class="menu-btn" aria-label="打开菜单" @click="menuOpen = true">
      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
    <span class="topbar-logo">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 5.5c2.5-.8 5-.8 8 1v13c-3-1.8-5.5-1.8-8-1z" />
        <path d="M20 5.5c-2.5-.8-5-.8-8 1v13c3-1.8 5.5-1.8 8-1z" />
        <path d="M12 6.5v13" />
      </svg>
      {{ siteName }}
    </span>
  </div>

  <!-- 全屏菜单（<484px） -->
  <Teleport to="body">
    <Transition name="menu">
      <div v-if="menuOpen" class="overlay">
        <div class="overlay-header">
          <button class="menu-btn" aria-label="关闭菜单" @click="menuOpen = false">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div class="overlay-search search">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索作品、作者、标签"
              @keyup.enter="submitSearch"
            />
          </div>
        </div>
        <nav class="overlay-nav">
          <RouterLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="overlay-item"
            active-class="active"
            @click="menuOpen = false"
          >
            <span class="nav-icon">
              <svg v-if="item.icon === 'store'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 9h15l-1.2 10.5a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3L4.5 9Z" />
                <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
                <path d="M12 6.5C10.5 5 8 4 5 4v14c3 0 5.5 1 7 2.5" />
                <path d="M12 6.5C13.5 5 16 4 19 4v14c-3 0-5.5 1-7 2.5" />
                <path d="M12 6.5v14" stroke-width="1.6" />
              </svg>
            </span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebar {
  display: none;
}

.topbar {
  display: none;
}

/* ---------------- ≥484px：常驻侧栏 ---------------- */
@media (min-width: 484px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--sidebar-width);
    background: var(--bg-sidebar);
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 20;
    transition: width 0.2s ease;
  }

  /* 收起态：70px 图标轨道（文字全部隐藏，元素居中） */
  .sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
  }

  .sidebar.collapsed .logo-row {
    justify-content: center;
    padding: 19px 0 14px;
  }

  /* 收起态搜索图标按钮（居中，默认隐藏） */
  .rail-search-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0 auto 10px;
    border-radius: 10px;
    color: var(--key-color);
  }

  .rail-search-btn svg {
    width: 20px;
    height: 20px;
  }

  .rail-search-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .sidebar.collapsed .rail-search-btn {
    display: flex;
  }

  .sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 10px 0;
  }

  /* 底部切换按钮区（贴侧栏底部） */
  .sidebar-footer {
    margin-top: auto;
    padding: 8px 12px 16px;
  }

  .collapse-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border-radius: 10px;
    color: var(--text-secondary);
    font: var(--text-footnote);
  }

  .collapse-toggle:hover {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
  }

  .toggle-chevron {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }

  /* 收起后箭头转向右（展开语义） */
  .toggle-chevron.point-right {
    transform: rotate(180deg);
  }

  .sidebar.collapsed .collapse-toggle {
    justify-content: center;
  }

  .sidebar.collapsed .logo-text,
  .sidebar.collapsed .nav-label {
    display: none;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 19px 25px 14px;
    font: 600 20px/1.3 var(--font-family);
  }

  .logo-icon {
    width: 26px;
    color: var(--key-color);
    flex-shrink: 0;
  }

  .search {
    position: relative;
    margin: 0 25px 10px;
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    translate: 0 -50%;
    width: 14px;
    height: 14px;
    color: var(--text-secondary);
    pointer-events: none;
  }

  .search input {
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: rgba(118, 118, 128, 0.24);
    color: var(--text-primary);
    font: var(--text-footnote);
    padding: 0 10px 0 28px;
    outline: none;
  }

  .search input::placeholder {
    color: var(--text-secondary);
  }

  .nav {
    display: flex;
    flex-direction: column;
    padding: 4px 12px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 9px 13px;
    border-radius: 10px;
    font-size: 16px;
    color: var(--text-primary);
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-icon {
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    color: var(--key-color);
  }

  .nav-icon svg {
    width: 20px;
    height: 20px;
  }

  .nav-item.active {
    color: var(--key-color);
    font-weight: 600;
  }

  .nav-item.active .nav-icon {
    color: var(--key-color);
  }
}

/* ---------------- <484px：顶栏 + 全屏菜单 ---------------- */
@media (max-width: 483px) {
  .topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    background: var(--bg-sidebar);
    border-bottom: 0.5px solid var(--bg-elevated);
    z-index: 20;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .menu-btn svg {
    width: 22px;
    height: 22px;
    fill: none;
  }

  .topbar-logo {
    display: flex;
    align-items: center;
    gap: 7px;
    font: 600 17px/1.3 var(--font-family);
  }

  .topbar-logo .logo-icon {
    width: 22px;
    color: var(--key-color);
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-sidebar);
    z-index: 100;
    overflow-y: auto;
  }

  .overlay-header {
    height: 52px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
  }

  .overlay-header .menu-btn svg {
    fill: none;
    width: 22px;
    height: 22px;
  }

  .overlay-search {
    position: relative;
    flex: 1;
    margin: 0;
  }

  .overlay-search .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    translate: 0 -50%;
    width: 14px;
    height: 14px;
    color: var(--text-secondary);
    pointer-events: none;
  }

  .overlay-search input {
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: rgba(118, 118, 128, 0.24);
    color: var(--text-primary);
    font: var(--text-footnote);
    padding: 0 10px 0 28px;
    outline: none;
  }

  .overlay-search input::placeholder {
    color: var(--text-secondary);
  }

  .overlay-nav {
    display: flex;
    flex-direction: column;
    padding: 12px 24px;
    gap: 4px;
  }

  .overlay-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 11px 0;
    font-size: 21px;
    color: var(--text-primary);
  }

  .overlay-item .nav-icon {
    display: flex;
    width: 32px;
    height: 32px;
    color: var(--key-color);
  }

  .overlay-item .nav-icon svg {
    width: 26px;
    height: 26px;
  }

  .overlay-item.active {
    color: var(--key-color);
    font-weight: 600;
  }

  .menu-enter-active,
  .menu-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .menu-enter-from,
  .menu-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
