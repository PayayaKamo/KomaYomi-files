<script setup lang="ts">
/**
 * ChartRow —— 榜单排名行（App Store 排行榜样式）
 * 序号 + 封面图标 + 名称 / 副标题 + 获取（未上架时为「准备中」）
 */
import type { Title } from '../../types/title'
import { chartSubtitle } from '../../data/titles'
import Artwork from '../media/Artwork.vue'

defineProps<{ item: Title; rank: number }>()
</script>

<template>
  <RouterLink :to="`/titles/${item.slug}`" class="chart-row">
    <span class="rank">{{ rank }}</span>
    <Artwork
      class="icon"
      :image="item.cover"
      :label="item.name"
      :accent-color="item.accentColor"
    />
    <div class="text">
      <span class="name">{{ item.name }}</span>
      <span class="sub">{{ chartSubtitle(item) }}</span>
    </div>
    <span class="get" :class="{ pending: item.pack.status !== 'available' }">
      {{ item.pack.status === 'available' ? '获取' : '准备中' }}
    </span>
  </RouterLink>
</template>

<style scoped>
.chart-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 4px;
  color: inherit;
}

.chart-row + .chart-row {
  border-top: 0.5px solid var(--bg-elevated);
}

.chart-row:hover .name {
  color: var(--key-color);
}

.rank {
  width: 22px;
  flex-shrink: 0;
  text-align: center;
  font: 600 17px/1 var(--font-family);
  color: var(--text-secondary);
}

.icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.name {
  font: var(--text-headline);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.sub {
  font: 400 12px/1.3 var(--font-family);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.get {
  margin-left: auto;
  flex-shrink: 0;
  font: 700 12px/1 var(--font-family);
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.15);
  padding: 7px 16px;
  border-radius: var(--radius-button);
  transition: background 0.15s ease;
}

.get.pending {
  color: var(--text-secondary);
  background: rgba(118, 118, 128, 0.24);
}
</style>
