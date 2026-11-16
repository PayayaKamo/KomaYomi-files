<script setup lang="ts">
/**
 * EditorPickCard —— 首页「编辑精选」小卡（海报式）
 * 封面 + 作品名 + 卷号/话数范围 + 一行短评 + 下载/查看按钮。
 * 三部作品统一使用这一种卡片，不再用整行大卡。
 */
import { computed } from 'vue'
import type { FeaturedCard, Title } from '../../types/title'
import Artwork from '../media/Artwork.vue'

const props = defineProps<{ card: FeaturedCard; item: Title }>()

const downloadUrl = computed(
  () => `${import.meta.env.BASE_URL}${props.item.pack.file}`,
)
</script>

<template>
  <article class="pick-card">
    <RouterLink :to="`/titles/${item.slug}`" class="cover-link" tabindex="-1" aria-hidden="true">
      <Artwork
        class="cover"
        :image="item.cover"
        :label="item.name"
        :accent-color="item.accentColor"
      />
    </RouterLink>
    <div class="body">
      <p class="heading">{{ card.heading }}</p>
      <RouterLink :to="`/titles/${item.slug}`" class="name">{{ item.name }}</RouterLink>
      <p class="sub">{{ card.subtitle }}</p>
      <p class="blurb" :title="card.blurb">{{ card.blurb }}</p>
      <div class="footer">
        <span class="state" :class="{ available: item.pack.status === 'available' }">
          {{ item.pack.status === 'available' ? item.pack.sizeLabel : '准备中' }}
        </span>
        <a
          v-if="item.pack.status === 'available'"
          class="cta"
          :href="downloadUrl"
          :download="`${item.slug}.mnproj`"
        >
          下载 .mnproj
        </a>
        <RouterLink v-else class="cta ghost" :to="`/titles/${item.slug}`">查看</RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.pick-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-large);
  overflow: hidden;
  background: var(--bg-card);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.pick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
}

.cover-link {
  display: block;
}

.cover {
  width: 100%;
  aspect-ratio: 3 / 4;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 16px 16px;
}

.heading {
  font: 600 11px/1.3 var(--font-family);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--key-color);
}

.name {
  font: var(--text-headline);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name:hover {
  color: var(--key-color);
}

.sub {
  font: 400 12px/1.35 var(--font-family);
  color: var(--text-secondary);
}

.blurb {
  font: var(--text-footnote);
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
}

.state {
  font: 600 11px/1 var(--font-family);
  color: var(--text-secondary);
  background: rgba(118, 118, 128, 0.24);
  padding: 5px 8px;
  border-radius: var(--radius-button);
  white-space: nowrap;
}

.state.available {
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.15);
}

.cta {
  flex-shrink: 0;
  font: 700 12px/1 var(--font-family);
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.15);
  padding: 8px 16px;
  border-radius: var(--radius-button);
  white-space: nowrap;
  transition: background 0.15s ease;
}

.cta:hover {
  background: rgba(10, 132, 255, 0.28);
}

.cta.ghost {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.cta.ghost:hover {
  background: rgba(118, 118, 128, 0.4);
}
</style>
