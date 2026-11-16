<script setup lang="ts">
/**
 * 作品货架（首页）—— /store
 *  - 页头大标题 + 日期 + 示例内容说明
 *  - 分类标签（全部 / 四格 / 日常 / 百合 / 新上架）
 *  - 编辑精选小卡（三部作品统一海报式小卡，桌面一行三张）
 *  - 精选合集横滑（同一批作品按编辑视角分组）
 *  - 榜单（示例排序：热门下载 / 话数 / 体量）
 *  - 全部作品海报货架
 *  - 支持 ?q=关键字（作品名 / 原名 / 作者 / 标签）
 */
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  categories,
  chartSortOptions,
  collections,
  featuredCards,
  titles,
  totalChapters,
} from '../data/titles'
import type { ChartSort, FeaturedCard, Title } from '../types/title'
import HorizontalShelf from '../components/shelves/HorizontalShelf.vue'
import PosterCard from '../components/cards/PosterCard.vue'
import EditorPickCard from '../components/cards/EditorPickCard.vue'
import ChartRow from '../components/cards/ChartRow.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'

const route = useRoute()
const now = new Date()
const week = ['日', '一', '二', '三', '四', '五', '六']
const dateLabel = `${now.getMonth() + 1}月${now.getDate()}日 星期${week[now.getDay()]}`

const query = computed(() => String(route.query.q ?? '').trim().toLowerCase())
const activeCategory = ref('all')
const chartSort = ref<ChartSort>('popularity')

function matches(item: Title, q: string): boolean {
  if (!q) return true
  return [item.name, item.originalName, item.romaji, item.author, ...item.tags]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

function inCategory(item: Title): boolean {
  const cat = activeCategory.value
  if (cat === 'all') return true
  if (cat === 'new') return item.isNew
  return item.tags.includes(cat)
}

const filteredTitles = computed(() =>
  titles.filter((t) => matches(t, query.value) && inCategory(t)),
)

const filteredCards = computed(() => {
  const slugs = new Set(filteredTitles.value.map((t) => t.slug))
  return featuredCards.filter((c) => slugs.has(c.slug))
})

/** 编辑精选小卡：把卡片数据与作品数据配成一对 */
const pickItems = computed(() =>
  filteredCards.value
    .map((card) => {
      const item = titles.find((t) => t.slug === card.slug)
      return item ? { card, item } : null
    })
    .filter((p): p is { card: FeaturedCard; item: Title } => p !== null),
)

const shelfGroups = computed(() =>
  collections
    .map((group) => ({
      ...group,
      items: group.slugs
        .map((slug) => titles.find((t) => t.slug === slug))
        .filter(
          (t): t is Title =>
            t !== undefined && filteredTitles.value.some((f) => f.slug === t.slug),
        ),
    }))
    .filter((group) => group.items.length > 0),
)

const chartTitles = computed(() => {
  const list = [...filteredTitles.value]
  return list.sort((a, b) => {
    if (chartSort.value === 'chapters') {
      return totalChapters(b) - totalChapters(a)
    }
    if (chartSort.value === 'size') {
      return b.store.estimatedSizeMb - a.store.estimatedSizeMb
    }
    return b.store.popularity - a.store.popularity
  })
})

const hasResult = computed(() => filteredTitles.value.length > 0)
</script>

<template>
  <div class="store-page">
    <header class="page-header">
      <h1 class="page-title">作品商店</h1>
      <p v-if="query" class="page-date">搜索：{{ query }}</p>
      <p v-else class="page-date">{{ dateLabel }}</p>
      <p class="page-lead">下载 .mnproj 工程文件，用 KomaYomi 打开阅读。</p>
      <p class="sample-note">评分、评论、榜单、合集与编辑精选文案均为示例内容，正式上架后替换。</p>
    </header>

    <nav class="category-tabs" aria-label="作品分类">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="category-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </nav>

    <p v-if="!hasResult" class="no-result">
      没有找到{{ query ? `与“${query}”相关的` : '' }}作品
    </p>

    <template v-if="hasResult">
      <!-- 编辑精选：三部作品统一小卡，桌面一行三张 -->
      <section v-if="pickItems.length" class="picks">
        <SectionHeader title="编辑精选" subtitle="三部作品，同一套海报小卡" />
        <div class="picks-grid">
          <EditorPickCard
            v-for="pick in pickItems"
            :key="pick.card.id"
            :card="pick.card"
            :item="pick.item"
          />
        </div>
      </section>

      <!-- 精选合集 -->
      <HorizontalShelf
        v-for="group in shelfGroups.slice(0, 2)"
        :key="group.id"
        :title="group.title"
        :subtitle="group.subtitle"
      >
        <PosterCard v-for="item in group.items" :key="group.id + item.slug" :item="item" />
      </HorizontalShelf>

      <!-- 榜单 -->
      <section class="chart-section">
        <div class="chart-head">
          <SectionHeader title="榜单" subtitle="示例排序，非真实下载数据" />
          <div class="sort-tabs">
            <button
              v-for="opt in chartSortOptions"
              :key="opt.value"
              type="button"
              class="sort-tab"
              :class="{ active: chartSort === opt.value }"
              @click="chartSort = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <ol class="chart-list">
          <li v-for="(item, index) in chartTitles" :key="item.slug">
            <ChartRow :item="item" :rank="index + 1" />
          </li>
        </ol>
        <p class="sample-note">示例内容，正式上架后替换。</p>
      </section>

      <!-- 全部作品 -->
      <HorizontalShelf
        title="全部作品"
        subtitle="每部作品打包为单个 .mnproj 工程，含三语对照页面"
      >
        <PosterCard v-for="item in filteredTitles" :key="item.slug" :item="item" />
      </HorizontalShelf>

      <!-- 第三个合集放在全部作品之后，避免首页开头堆叠过多横滑 -->
      <template v-if="shelfGroups.length > 2">
        <HorizontalShelf
          v-for="group in shelfGroups.slice(2)"
          :key="group.id"
          :title="group.title"
          :subtitle="group.subtitle"
        >
          <PosterCard v-for="item in group.items" :key="group.id + item.slug" :item="item" />
        </HorizontalShelf>
      </template>
    </template>

    <section v-if="!query" class="how-to">
      <SectionHeader title="怎么读" subtitle="下载得到的是工程文件，不是 PDF" />
      <ol class="steps">
        <li class="step">
          <span class="step-num">1</span>
          <div>
            <h3 class="step-title">下载 .mnproj</h3>
            <p class="step-text">在作品详情页点「下载 .mnproj」，得到单个工程文件。</p>
          </div>
        </li>
        <li class="step">
          <span class="step-num">2</span>
          <div>
            <h3 class="step-title">用 KomaYomi 打开</h3>
            <p class="step-text">桌面版「文件 → 打开工程」，移动版在库页面导入。</p>
          </div>
        </li>
        <li class="step">
          <span class="step-num">3</span>
          <div>
            <h3 class="step-title">对照阅读与笔记</h3>
            <p class="step-text">同一页可并排查看日 / 中 / 英三语，边读边做笔记。</p>
          </div>
        </li>
      </ol>
      <RouterLink to="/guide" class="guide-link">
        查看完整使用指南
        <svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.5 2.5 10 10l-7.5 7.5" />
        </svg>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  padding: 18px var(--body-gutter) 14px;
}

.page-title {
  font: var(--text-page-title);
  color: var(--text-primary);
}

.page-date {
  font: var(--text-callout);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  margin-top: 2px;
}

.page-lead {
  font: var(--text-body);
  color: var(--text-secondary);
  margin-top: 8px;
}

.sample-note {
  font: 400 11px/1.4 var(--font-family);
  color: var(--text-tertiary);
  margin-top: 6px;
}

/* ---------------- 分类标签 ---------------- */
.category-tabs {
  display: flex;
  gap: 8px;
  padding: 2px var(--body-gutter) 16px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex-shrink: 0;
  padding: 7px 14px;
  border-radius: var(--radius-button);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font: 600 13px/1 var(--font-family);
  transition: background 0.15s ease, color 0.15s ease;
}

.category-tab:hover {
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--text-primary);
  color: var(--bg);
}

.no-result {
  padding: 60px var(--body-gutter);
  text-align: center;
  font: var(--text-body);
  color: var(--text-secondary);
}

/* ---------------- 编辑精选 ---------------- */
.picks {
  padding-bottom: 4px;
}

.picks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 0 var(--body-gutter);
}

@media (min-width: 560px) {
  .picks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .picks-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ---------------- 榜单 ---------------- */
.chart-section {
  padding: 8px 0 20px;
}

.chart-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-right: var(--body-gutter);
}

.sort-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
}

.sort-tab {
  padding: 6px 12px;
  border-radius: var(--radius-button);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font: 600 12px/1 var(--font-family);
  transition: background 0.15s ease, color 0.15s ease;
}

.sort-tab:hover {
  color: var(--text-primary);
}

.sort-tab.active {
  background: rgba(10, 132, 255, 0.16);
  color: var(--key-color);
}

.chart-list {
  margin: 0 var(--body-gutter);
  padding: 6px 14px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
  list-style: none;
}

.chart-section .sample-note {
  margin: 8px var(--body-gutter) 0;
}

/* ---------------- 使用步骤 ---------------- */
.how-to {
  padding: 8px 0 40px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 0 var(--body-gutter);
  list-style: none;
}

@media (min-width: 900px) {
  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.step {
  display: flex;
  gap: 12px;
  padding: 18px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
}

.step-num {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(10, 132, 255, 0.15);
  color: var(--key-color);
  font: 700 13px/1 var(--font-family);
}

.step-title {
  font: var(--text-headline);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.step-text {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.45;
}

.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 16px var(--body-gutter) 0;
  font: var(--text-headline);
  color: var(--key-color);
}

.guide-link svg {
  height: 11px;
  width: auto;
}

@media (max-width: 599px) {
  .chart-head {
    display: block;
  }

  .sort-tabs {
    margin: 0 0 12px;
  }
}
</style>
