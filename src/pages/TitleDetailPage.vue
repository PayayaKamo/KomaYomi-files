<script setup lang="ts">
/**
 * 作品详情页 —— /titles/:slug
 * 参考 MangaDex 的信息结构：作品信息 + 下载主按钮 + 按卷折叠的章节目录，
 * 视觉沿用 App Store 详情页的头部 / 信息栅格 / 栏目排版。
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Artwork from '../components/media/Artwork.vue'
import {
  KOMAYOMI_LINKS,
  chapterRange,
  findTitle,
  totalChapters,
} from '../data/titles'
import type { VolumeRef } from '../types/title'

const route = useRoute()
const router = useRouter()

const title = computed(() => findTitle(String(route.params.slug)))

/** 展开的卷（默认展开第一段） */
const openVolumes = ref<Set<number>>(new Set())

watch(
  () => title.value?.slug,
  () => {
    const first = title.value?.volumes[0]
    openVolumes.value = first ? new Set([first.number]) : new Set()
  },
  { immediate: true },
)

function isOpen(volume: VolumeRef): boolean {
  return openVolumes.value.has(volume.number)
}

function toggleVolume(volume: VolumeRef): void {
  const next = new Set(openVolumes.value)
  if (next.has(volume.number)) next.delete(volume.number)
  else next.add(volume.number)
  openVolumes.value = next
}

function packedIn(volume: VolumeRef): number {
  return volume.chapters.filter((c) => c.packed).length
}

const downloadUrl = computed(() =>
  title.value ? `${import.meta.env.BASE_URL}${title.value.pack.file}` : '',
)

const infoRows = computed(() => {
  const t = title.value
  if (!t) return []
  const volume = t.volumes[t.volumes.length - 1]
  return [
    { label: '作者', value: t.author },
    { label: '状态', value: t.status },
    { label: '卷 / 话', value: `第 ${volume.number} 卷 · ${totalChapters(t)} 话` },
    { label: '包内收录', value: t.pack.contents },
    { label: '语言', value: '日本語 / 中文 / English' },
    { label: '格式', value: 'KomaYomi 工程（.mnproj）' },
    {
      label: '体量',
      value: t.pack.status === 'available' ? t.pack.sizeLabel : '未上架',
    },
    { label: '文件名', value: t.pack.file.split('/').pop() ?? t.pack.file },
  ]
})
</script>

<template>
  <div v-if="title" class="detail-page">
    <div class="top-nav">
      <button class="back" @click="router.back()">‹ 返回</button>
      <RouterLink to="/store" class="store-link">作品商店</RouterLink>
    </div>

    <!-- ============ 作品头部 ============ -->
    <header class="hero">
      <Artwork
        class="cover"
        :image="title.cover"
        :label="title.name"
        :accent-color="title.accentColor"
      />
      <div class="hero-meta">
        <p class="eyebrow">KomaYomi 作品</p>
        <h1 class="title">{{ title.name }}</h1>
        <p class="original">{{ title.originalName }} · {{ title.romaji }}</p>
        <p class="author">{{ title.author }} · {{ title.status }}</p>
        <div class="tags">
          <span v-for="tag in title.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="hero-action">
        <a
          v-if="title.pack.status === 'available'"
          class="download-btn"
          :href="downloadUrl"
          :download="`${title.slug}.mnproj`"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 4v11" />
            <path d="m7 11 5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
          下载 .mnproj
        </a>
        <button
          v-else
          class="download-btn"
          type="button"
          disabled
          title="作品包尚未上架，敬请期待"
        >
          准备中
        </button>
        <p class="action-meta">
          {{ title.pack.status === 'available' ? title.pack.sizeLabel : '作品包尚未上架' }}
        </p>
        <p class="action-sub">{{ title.pack.contents }}</p>
      </div>
    </header>

    <!-- ============ 下载前提说明 ============ -->
    <section class="download-note">
      <span class="note-icon">i</span>
      <p class="note-text">
        下载得到的是单个 <strong>.mnproj</strong> 工程文件，不是 PDF 或视频。需要用
        <a :href="KOMAYOMI_LINKS.desktop" target="_blank" rel="noopener noreferrer">KomaYomi 桌面版</a>
        或
        <a :href="KOMAYOMI_LINKS.mobile" target="_blank" rel="noopener noreferrer">移动版</a>
        打开：桌面版从「文件 → 打开工程」载入，移动版在库页面导入。也可先看
        <RouterLink to="/guide">使用指南</RouterLink>。
      </p>
    </section>

    <!-- ============ 简介 ============ -->
    <section class="section">
      <h2 class="section-title">简介</h2>
      <p class="description">{{ title.summary }}</p>
    </section>

    <!-- ============ 作品信息 ============ -->
    <section class="section">
      <h2 class="section-title">作品信息</h2>
      <dl class="info-grid">
        <div v-for="row in infoRows" :key="row.label" class="info-row">
          <dt class="info-label">{{ row.label }}</dt>
          <dd class="info-value">{{ row.value }}</dd>
        </div>
      </dl>
      <a
        class="source-link"
        :href="title.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        作品来源 · MangaDex
        <span aria-hidden="true">↗</span>
      </a>
    </section>

    <!-- ============ 章节目录（按卷折叠） ============ -->
    <section class="section">
      <h2 class="section-title">章节目录</h2>
      <p class="chapters-note">
        章节标题暂未收录，仅显示话号；标记「本包收录」的话在下载的 .mnproj 内可直接阅读。
      </p>
      <ul class="volume-list">
        <li v-for="volume in title.volumes" :key="volume.number" class="volume">
          <button
            class="volume-head"
            type="button"
            :aria-expanded="isOpen(volume)"
            @click="toggleVolume(volume)"
          >
            <span class="volume-chevron" :class="{ open: isOpen(volume) }">▸</span>
            <span class="volume-name">第 {{ volume.number }} 卷</span>
            <span class="volume-range">{{ chapterRange(volume) }}</span>
            <span class="volume-count">{{ volume.chapters.length }} 话</span>
            <span v-if="packedIn(volume)" class="volume-packed">
              本包收录 {{ packedIn(volume) }} 话
            </span>
          </button>
          <div v-if="isOpen(volume)" class="chapter-grid">
            <div
              v-for="chapter in volume.chapters"
              :key="chapter.number"
              class="chapter"
              :class="{ packed: chapter.packed }"
            >
              <span class="chapter-no">第 {{ chapter.number }} 话</span>
              <span v-if="chapter.packed" class="chapter-badge">本包收录</span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ============ 打开方式 ============ -->
    <section class="section">
      <h2 class="section-title">打开方式</h2>
      <div class="open-card">
        <p class="open-text">KomaYomi 支持桌面与移动端，工程格式互通，笔记与标注保存在工程内。</p>
        <div class="open-links">
          <a :href="KOMAYOMI_LINKS.desktop" target="_blank" rel="noopener noreferrer" class="open-link">
            桌面版 · GitHub <span aria-hidden="true">↗</span>
          </a>
          <a :href="KOMAYOMI_LINKS.mobile" target="_blank" rel="noopener noreferrer" class="open-link">
            移动版 · GitHub <span aria-hidden="true">↗</span>
          </a>
          <RouterLink to="/guide" class="open-link">使用指南</RouterLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <p class="not-found-title">没有找到这部作品</p>
    <RouterLink to="/store" class="not-found-link">返回作品商店</RouterLink>
  </div>
</template>

<style scoped>
.detail-page {
  padding: 18px var(--body-gutter) 60px;
  max-width: 1100px;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.back {
  display: inline-flex;
  align-items: center;
  color: var(--key-color);
  font-size: 15px;
  padding: 7px 14px;
  border-radius: var(--radius-button);
  background: rgba(255, 255, 255, 0.06);
}

.back:hover {
  background: rgba(255, 255, 255, 0.1);
}

.store-link {
  font: var(--text-footnote);
  color: var(--text-secondary);
}

.store-link:hover {
  color: var(--text-primary);
}

/* ============ 头部 ============ */
.hero {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: start;
  gap: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--bg-elevated);
}

.cover {
  width: 200px;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-large);
  overflow: hidden;
  box-shadow: var(--shadow-small);
}

.hero-meta {
  min-width: 0;
  padding-top: 4px;
}

.eyebrow {
  font: var(--text-callout);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.title {
  font: 800 32px/1.15 var(--font-family);
  color: var(--text-primary);
  margin-bottom: 6px;
}

.original {
  font: 400 15px/1.4 var(--font-family);
  color: var(--text-secondary);
}

.author {
  font: 600 14px/1.4 var(--font-family);
  color: var(--text-primary);
  margin-top: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.tag {
  font: 500 12px/1 var(--font-family);
  padding: 5px 10px;
  border-radius: var(--radius-button);
  background: var(--bg-elevated);
  color: var(--text-secondary);
}

.hero-action {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  min-width: 150px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: 700 16px/1 var(--font-family);
  color: #fff;
  background: var(--key-color);
  border-radius: var(--radius-button);
  padding: 14px 24px;
  text-align: center;
  transition: filter 0.15s ease;
}

.download-btn svg {
  width: 18px;
  height: 18px;
}

.download-btn:hover {
  filter: brightness(1.1);
}

.download-btn:disabled {
  background: var(--text-secondary);
  opacity: 0.45;
  cursor: not-allowed;
  filter: none;
}

.action-meta {
  font: 400 12px/1.3 var(--font-family);
  color: var(--text-secondary);
  text-align: center;
}

.action-sub {
  font: 400 12px/1.3 var(--font-family);
  color: var(--text-tertiary);
  text-align: center;
}

/* ============ 下载说明 ============ */
.download-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
}

.note-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(10, 132, 255, 0.15);
  color: var(--key-color);
  font: 700 12px/1 var(--font-family);
  margin-top: 1px;
}

.note-text {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.55;
}

.note-text strong {
  color: var(--text-primary);
}

.note-text a {
  color: var(--key-color);
}

/* ============ 栏目 ============ */
.section {
  padding-top: 30px;
}

.section-title {
  font: 700 22px/1.2 var(--font-family);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.description {
  font: var(--text-body);
  color: var(--text-primary);
  line-height: 1.65;
  max-width: 760px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 40px;
}

.info-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  align-items: baseline;
  padding: 6px 0;
  border-bottom: 0.5px solid var(--bg-elevated);
}

.info-label {
  font: 400 13px/1.3 var(--font-family);
  color: var(--text-secondary);
}

.info-value {
  font: 400 14px/1.35 var(--font-family);
  color: var(--text-primary);
  margin: 0;
  overflow-wrap: anywhere;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  font: var(--text-footnote);
  color: var(--key-color);
}

/* ============ 章节目录 ============ */
.chapters-note {
  font: var(--text-footnote);
  color: var(--text-secondary);
  margin: -4px 0 14px;
}

.volume-list {
  border-radius: var(--radius-large);
  overflow: hidden;
  background: var(--bg-card);
}

.volume + .volume {
  border-top: 1px solid var(--bg);
}

.volume-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  text-align: left;
  color: var(--text-primary);
}

.volume-head:hover {
  background: rgba(255, 255, 255, 0.04);
}

.volume-chevron {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.15s ease;
}

.volume-chevron.open {
  transform: rotate(90deg);
}

.volume-name {
  font: 600 15px/1.3 var(--font-family);
  white-space: nowrap;
}

.volume-range {
  font: var(--text-footnote);
  color: var(--text-secondary);
  white-space: nowrap;
}

.volume-count {
  font: 400 12px/1.3 var(--font-family);
  color: var(--text-tertiary);
  white-space: nowrap;
}

.volume-packed {
  margin-left: auto;
  flex-shrink: 0;
  font: 600 11px/1 var(--font-family);
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.14);
  padding: 4px 8px;
  border-radius: var(--radius-button);
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  padding: 4px 18px 18px;
}

.chapter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 10px;
  background: var(--bg);
}

.chapter-no {
  font: 400 13px/1.3 var(--font-family);
  color: var(--text-secondary);
  white-space: nowrap;
}

.chapter.packed .chapter-no {
  color: var(--text-primary);
  font-weight: 600;
}

.chapter-badge {
  flex-shrink: 0;
  font: 600 10px/1 var(--font-family);
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.14);
  padding: 3px 6px;
  border-radius: var(--radius-button);
}

/* ============ 打开方式 ============ */
.open-card {
  padding: 18px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
}

.open-text {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.55;
}

.open-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.open-link {
  font: 600 13px/1 var(--font-family);
  color: var(--key-color);
  background: rgba(10, 132, 255, 0.12);
  padding: 9px 14px;
  border-radius: var(--radius-button);
}

.open-link:hover {
  background: rgba(10, 132, 255, 0.2);
}

/* ============ 空状态 ============ */
.not-found {
  padding: 80px var(--body-gutter);
  text-align: center;
}

.not-found-title {
  font: var(--text-shelf-title);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.not-found-link {
  font: var(--text-headline);
  color: var(--key-color);
}

/* ============ 响应式 ============ */
@media (max-width: 899px) {
  .hero {
    grid-template-columns: 150px 1fr;
    gap: 20px;
  }

  .cover {
    width: 150px;
  }

  .hero-action {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .download-btn {
    min-width: 150px;
  }

  .action-meta,
  .action-sub {
    text-align: left;
  }
}

@media (max-width: 599px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .cover {
    width: 140px;
  }

  .title {
    font-size: 26px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .volume-head {
    flex-wrap: wrap;
    gap: 8px 10px;
  }

  .volume-packed {
    margin-left: 0;
  }
}
</style>
