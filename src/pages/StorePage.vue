<script setup lang="ts">
/**
 * 作品货架（首页）—— /store
 *  - 页头大标题 + 日期
 *  - 精选大卡（沿用 TodayCard 布局）
 *  - 全部作品横滑货架（PosterCard）
 *  - 支持 ?q=关键字 搜索（作品名 / 原名 / 作者 / 标签）
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { featuredCards, titles } from '../data/titles'
import type { Title } from '../types/title'
import TodayCardRow from '../components/cards/TodayCardRow.vue'
import HorizontalShelf from '../components/shelves/HorizontalShelf.vue'
import PosterCard from '../components/cards/PosterCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'

const route = useRoute()
const now = new Date()
const week = ['日', '一', '二', '三', '四', '五', '六']
const dateLabel = `${now.getMonth() + 1}月${now.getDate()}日 星期${week[now.getDay()]}`

const query = computed(() => String(route.query.q ?? '').trim().toLowerCase())

function matches(item: Title, q: string): boolean {
  if (!q) return true
  return [item.name, item.originalName, item.romaji, item.author, ...item.tags]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

const filteredTitles = computed(() => titles.filter((t) => matches(t, query.value)))

const filteredCards = computed(() => {
  const q = query.value
  if (!q) return featuredCards
  const slugs = new Set(filteredTitles.value.map((t) => t.slug))
  return featuredCards.filter((c) => slugs.has(c.slug))
})

const hasResult = computed(
  () => filteredTitles.value.length > 0 || filteredCards.value.length > 0,
)
</script>

<template>
  <div class="store-page">
    <header class="page-header">
      <h1 class="page-title">作品商店</h1>
      <p v-if="query" class="page-date">搜索：{{ query }}</p>
      <p v-else class="page-date">{{ dateLabel }}</p>
      <p class="page-lead">下载 .mnproj 工程文件，用 KomaYomi 打开阅读。</p>
    </header>

    <p v-if="!hasResult" class="no-result">没有找到与“{{ query }}”相关的作品</p>

    <TodayCardRow v-if="filteredCards.length" :cards="filteredCards" :stretch-first="true" />

    <HorizontalShelf
      v-if="filteredTitles.length"
      title="全部作品"
      subtitle="每部作品打包为单个 .mnproj 工程，含三语对照页面"
    >
      <PosterCard v-for="item in filteredTitles" :key="item.slug" :item="item" />
    </HorizontalShelf>

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
  padding: 18px var(--body-gutter) 18px;
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

.no-result {
  padding: 60px var(--body-gutter);
  text-align: center;
  font: var(--text-body);
  color: var(--text-secondary);
}

.how-to {
  padding: 8px 0 40px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 0 var(--body-gutter);
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
</style>
