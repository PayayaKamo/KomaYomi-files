<script setup lang="ts">
/**
 * TodayCardRow —— 忠实移植泄露码 TodayCardShelf.svelte 的布局规则：
 *  - 卡片 3/4 比例、高 534px（桌面）、上限 600px；移动端单列全宽
 *  - ≥1000px 才横向排列（苹果 --range-medium-up，含侧边栏偏移）
 *  - 1/2/3/4 卡各有一套拉伸规则，2/3 卡时交替拉伸首/尾卡
 */
import type { FeaturedCard } from '../../types/title'
import TodayCard from './TodayCard.vue'

const props = withDefaults(
  defineProps<{
    cards: FeaturedCard[]
    /** 交替拉伸方向（多行卡片时由页面轮换，模拟苹果 today-card-layout 上下文） */
    stretchFirst?: boolean
  }>(),
  { stretchFirst: false },
)

const count = props.cards.length
const show = props.cards.slice(0, 4)
</script>

<template>
  <div
    class="today-card-row"
    :class="[
      `row-${Math.min(count, 4)}-card`,
      stretchFirst ? 'stretch-first' : 'stretch-last',
    ]"
  >
    <div v-for="card in show" :key="card.id" class="today-card-wrapper">
      <TodayCard :card="card" />
    </div>
  </div>
</template>

<style scoped>
.today-card-row {
  --card-default-width: 407px;
  --card-default-height: 534px;
  --card-row-gap: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--card-row-gap);
  padding: 0 var(--body-gutter) 24px;
}

.today-card-wrapper {
  aspect-ratio: 3 / 4;
  width: 100%;
  flex-shrink: 0;
  max-height: 600px;
  min-height: 100px;
}

/* ---------- ≥1000px：横排 + 拉伸规则（苹果原版） ---------- */
@media (min-width: 1000px) {
  .today-card-row {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .today-card-wrapper {
    width: auto;
    height: var(--card-default-height);
    aspect-ratio: 3 / 4;
  }

  .stretch-first :deep(*),
  .stretch-last :deep(*) {
    min-width: 0;
  }

  /* 1 卡：占满整行 */
  .row-1-card .today-card-wrapper {
    flex-grow: 1;
    align-self: stretch;
    aspect-ratio: unset;
  }

  /* 2 卡：按方向拉伸首卡或尾卡 */
  .row-2-card.stretch-first .today-card-wrapper:first-child,
  .row-2-card.stretch-last .today-card-wrapper:last-child {
    flex-grow: 1;
    justify-self: stretch;
    align-self: stretch;
    aspect-ratio: unset;
  }

  /* 3 卡：首卡整行，余下两张按方向拉伸其一 */
  .row-3-card .today-card-wrapper:first-child {
    flex-basis: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    align-self: stretch;
    aspect-ratio: unset;
  }

  .row-3-card.stretch-first .today-card-wrapper:nth-child(2),
  .row-3-card.stretch-last .today-card-wrapper:last-child {
    flex-grow: 1;
    justify-self: stretch;
    align-self: stretch;
    aspect-ratio: unset;
  }

  /* 4 卡：交替方向的拉伸卡占满剩余宽度 */
  .row-4-card.stretch-first .today-card-wrapper:first-child,
  .row-4-card.stretch-first .today-card-wrapper:last-child,
  .row-4-card.stretch-last .today-card-wrapper:nth-child(2),
  .row-4-card.stretch-last .today-card-wrapper:nth-child(3) {
    flex-basis: calc(100% - var(--card-default-width) - var(--card-row-gap));
    flex-grow: 1;
    flex-shrink: 1;
    align-self: stretch;
    aspect-ratio: unset;
  }
}
</style>
