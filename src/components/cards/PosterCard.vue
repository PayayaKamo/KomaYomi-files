<script setup lang="ts">
/**
 * PosterCard —— 作品海报卡（沿用 16/9 砖块样式）
 * 展示：封面、标题、原名、作者、卷/话数、标签、下载体量
 */
import { computed } from 'vue'
import type { Title } from '../../types/title'
import Artwork from '../media/Artwork.vue'

const props = withDefaults(
  defineProps<{ item: Title; accentColor?: string; subtitle?: string }>(),
  { accentColor: undefined, subtitle: undefined },
)

const volume = computed(() => props.item.volumes[props.item.volumes.length - 1])
const chapterCount = computed(() =>
  props.item.volumes.reduce((sum, v) => sum + v.chapters.length, 0),
)
const metaLine = computed(
  () =>
    props.subtitle ??
    `${props.item.author} · 第 ${volume.value.number} 卷 · ${chapterCount.value} 话`,
)
</script>

<template>
  <RouterLink :to="`/titles/${item.slug}`" class="poster-card">
    <Artwork
      :image="item.cover"
      :label="item.name"
      :accent-color="accentColor ?? item.accentColor"
      class="poster"
    />
    <div class="info">
      <div class="name-row">
        <span class="name">{{ item.name }}</span>
        <span class="state" :class="item.pack.status">
          {{ item.pack.status === 'available' ? item.pack.sizeLabel : '准备中' }}
        </span>
      </div>
      <span class="original">{{ item.originalName }}</span>
      <span class="meta">{{ metaLine }}</span>
      <div class="tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.poster-card {
  display: block;
  width: 320px;
}

.poster {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-large);
  overflow: hidden;
  box-shadow: var(--shadow-small);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 2px 0;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.name {
  font: var(--text-footnote);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.state {
  flex-shrink: 0;
  font: 600 11px/1 var(--font-family);
  padding: 3px 7px;
  border-radius: var(--radius-button);
  color: var(--text-secondary);
  background: rgba(118, 118, 128, 0.24);
}

.state.available {
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.15);
}

.original {
  font: 400 12px/1.35 var(--font-family);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  font: 400 12px/1.35 var(--font-family);
  color: var(--text-tertiary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
}

.tag {
  font: 500 11px/1 var(--font-family);
  padding: 4px 8px;
  border-radius: var(--radius-button);
  background: var(--bg-elevated);
  color: var(--text-secondary);
}
</style>
