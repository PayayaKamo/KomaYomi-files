<script setup lang="ts">
/**
 * 作品详情页 —— /titles/:slug
 * 参考 App Store 详情页结构：头图 + 图标 + 名称/评分/获取按钮 → 截图横滑 →
 * 简介（展开收起）→ 信息表 → 评分与评论 → 章节目录 → 版本历史 → 打开方式。
 * 评分、评论、版本历史均为示例数据，页面上有明确标注。
 */
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Artwork from '../components/media/Artwork.vue'
import {
  KOMAYOMI_LINKS,
  chapterRange,
  displaySize,
  findTitle,
  totalChapters,
} from '../data/titles'
import type { VolumeRef } from '../types/title'

const route = useRoute()
const router = useRouter()

const title = computed(() => findTitle(String(route.params.slug)))

/** 展开的卷（默认展开本包收录的那一卷，否则展开第一卷） */
const openVolumes = ref<Set<string>>(new Set())

/** 简介是否展开 */
const descOpen = ref(false)

watch(
  () => title.value?.slug,
  () => {
    const vols = title.value?.volumes ?? []
    const packed = vols.find((v) => v.chapters.some((c) => c.packed)) ?? vols[0]
    openVolumes.value = packed ? new Set([packed.number]) : new Set()
    descOpen.value = false
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

/** 星级填充宽度 */
function starWidth(rating: number): string {
  return `${(rating / 5) * 100}%`
}

const downloadUrl = computed(() =>
  title.value ? `${import.meta.env.BASE_URL}${title.value.pack.file}` : '',
)

const infoRows = computed(() => {
  const t = title.value
  if (!t) return []
  const volume = t.volumes[t.volumes.length - 1]
  return [
    { label: '开发者', value: t.store.developer },
    { label: '大小', value: displaySize(t) },
    { label: '版本', value: t.store.version },
    { label: '更新时间', value: t.store.updatedAt },
    { label: '语言', value: '日本語 / 中文 / English' },
    { label: '兼容平台', value: 'KomaYomi 桌面版 / 移动版 / 在线版' },
    { label: '卷 / 话', value: `第 ${volume.number} 卷 · ${totalChapters(t)} 话` },
    { label: '包内收录', value: t.pack.contents },
    { label: '格式', value: 'KomaYomi 工程（.mnproj）' },
    { label: '作品包', value: t.pack.file.split('/').pop() ?? t.pack.file },
  ]
})
</script>

<template>
  <div v-if="title" class="detail-page">
    <div class="top-nav">
      <button class="back" @click="router.back()">‹ 返回</button>
      <RouterLink to="/store" class="store-link">作品商店</RouterLink>
    </div>

    <!-- ============ 头图 + 图标 + 获取 ============ -->
    <header class="hero">
      <div class="hero-backdrop" :style="{ backgroundImage: `url(${title.cover})` }"></div>
      <div class="hero-shade"></div>
      <div class="hero-content">
        <Artwork
          class="hero-icon"
          :image="title.cover"
          :label="title.name"
          :accent-color="title.accentColor"
        />
        <div class="hero-meta">
          <p class="eyebrow">{{ title.originalName }}</p>
          <h1 class="title">{{ title.name }}</h1>
          <p class="romaji">{{ title.romaji }} · {{ title.status }}</p>
          <div class="rating-line">
            <span class="stars" :aria-label="`${title.store.rating.toFixed(1)} 分`">
              <span class="stars-track">★★★★★</span>
              <span class="stars-fill" :style="{ width: starWidth(title.store.rating) }">★★★★★</span>
            </span>
            <span class="rating-text">
              {{ title.store.rating.toFixed(1) }} · {{ title.store.ratingCount }} 个评分
            </span>
            <span class="sample-chip">示例</span>
          </div>
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
          <p class="action-meta">{{ displaySize(title) }}</p>
          <p class="action-sub">{{ title.pack.contents }}</p>
        </div>
      </div>
    </header>

    <!-- ============ 截图横滑 ============ -->
    <section class="section shot-section">
      <h2 class="section-title">预览</h2>
      <div class="shot-viewport">
        <div class="shot-rail">
          <figure v-for="shot in title.store.screenshots" :key="shot.src" class="shot">
            <img :src="shot.src" :alt="`${title.name} ${shot.label}`" loading="lazy" />
            <figcaption class="shot-label">{{ shot.label }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ============ 简介 ============ -->
    <section class="section">
      <h2 class="section-title">简介</h2>
      <p class="description" :class="{ clamped: !descOpen }">{{ title.summary }}</p>
      <button type="button" class="more-btn" @click="descOpen = !descOpen">
        {{ descOpen ? '收起' : '更多' }}
      </button>
    </section>

    <!-- ============ 信息表 ============ -->
    <section class="section">
      <h2 class="section-title">信息</h2>
      <dl class="info-table">
        <div v-for="row in infoRows" :key="row.label" class="info-row">
          <dt class="info-label">{{ row.label }}</dt>
          <dd class="info-value">{{ row.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- ============ 评分与评论 ============ -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">评分与评论</h2>
        <span class="sample-chip">示例内容</span>
      </div>
      <div class="rating-card">
        <div class="rating-summary">
          <span class="rating-big">{{ title.store.rating.toFixed(1) }}</span>
          <span class="stars stars-large" :aria-hidden="true">
            <span class="stars-track">★★★★★</span>
            <span class="stars-fill" :style="{ width: starWidth(title.store.rating) }">★★★★★</span>
          </span>
          <span class="rating-count">{{ title.store.ratingCount }} 个评分</span>
        </div>
        <ul class="review-list">
          <li v-for="review in title.store.reviews" :key="review.author" class="review">
            <div class="review-head">
              <span class="review-author">{{ review.author }}</span>
              <span class="review-date">{{ review.date }}</span>
            </div>
            <span class="stars review-stars" :aria-hidden="true">
              <span class="stars-track">★★★★★</span>
              <span class="stars-fill" :style="{ width: starWidth(review.rating) }">★★★★★</span>
            </span>
            <p class="review-title">{{ review.title }}</p>
            <p class="review-text">{{ review.text }}</p>
          </li>
        </ul>
      </div>
      <p class="sample-note">以上评分与评论为示例内容，正式上架后替换。</p>
    </section>

    <!-- ============ 章节目录（按卷折叠） ============ -->
    <section class="section">
      <h2 class="section-title">章节目录</h2>
      <p class="chapters-note">
        章节标题暂未收录，仅显示话号；标记「本包收录」的话在下载的 .mnproj 内可直接阅读。
      </p>
      <p v-if="title.chapterNote" class="chapters-note chapters-note-extra">
        {{ title.chapterNote }}
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
            <span v-else class="volume-missing">未收录</span>
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

    <!-- ============ 版本历史 ============ -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">版本历史</h2>
        <span class="sample-chip">示例</span>
      </div>
      <ul class="history">
        <li v-for="entry in title.store.changelog" :key="entry.version" class="history-item">
          <div class="history-head">
            <span class="history-version">v{{ entry.version }}</span>
            <span class="history-date">{{ entry.date }}</span>
          </div>
          <ul class="history-notes">
            <li v-for="note in entry.notes" :key="note" class="history-note">{{ note }}</li>
          </ul>
        </li>
      </ul>
      <p class="sample-note">版本号与更新日志为示例内容，正式上架后替换。</p>
    </section>

    <!-- ============ 打开方式 ============ -->
    <section class="section">
      <h2 class="section-title">打开方式</h2>
      <div class="open-card">
        <p class="open-text">
          下载得到的是单个 <strong>.mnproj</strong> 工程文件，不是 PDF 或视频。需要
          <a :href="KOMAYOMI_LINKS.desktop" target="_blank" rel="noopener noreferrer">KomaYomi 桌面版</a>
          或
          <a :href="KOMAYOMI_LINKS.mobile" target="_blank" rel="noopener noreferrer">移动版</a>
          打开：桌面版从「文件 → 打开工程」载入，移动版在库页面导入。
        </p>
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

/* ============ 头图 ============ */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-large);
  background: var(--bg-card);
}

.hero-backdrop {
  position: absolute;
  inset: -24px;
  background-size: cover;
  background-position: center 30%;
  filter: blur(38px) saturate(1.25);
  opacity: 0.55;
}

.hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 70%, var(--bg-card) 100%);
}

.hero-content {
  position: relative;
  display: grid;
  grid-template-columns: 132px 1fr auto;
  align-items: end;
  gap: 24px;
  padding: 32px 28px 24px;
}

.hero-icon {
  width: 132px;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-icon);
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}

.hero-meta {
  min-width: 0;
  padding-bottom: 2px;
}

.eyebrow {
  font: 600 12px/1.3 var(--font-family);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
}

.title {
  font: 800 30px/1.15 var(--font-family);
  color: #fff;
  margin: 4px 0 3px;
}

.romaji {
  font: 400 14px/1.4 var(--font-family);
  color: rgba(255, 255, 255, 0.75);
}

.rating-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.rating-text {
  font: 600 12px/1 var(--font-family);
  color: rgba(255, 255, 255, 0.8);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  font: 500 12px/1 var(--font-family);
  padding: 5px 10px;
  border-radius: var(--radius-button);
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
}

.hero-action {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  min-width: 168px;
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
  padding: 12px 24px;
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
  background: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
  filter: none;
}

.action-meta,
.action-sub {
  font: 400 12px/1.3 var(--font-family);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.action-sub {
  color: rgba(255, 255, 255, 0.55);
}

/* ============ 星级 ============ */
.stars {
  position: relative;
  display: inline-block;
  font-size: 13px;
  line-height: 1;
  letter-spacing: 1px;
  white-space: nowrap;
}

.stars-track {
  color: rgba(255, 255, 255, 0.22);
}

.stars-fill {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  white-space: nowrap;
  color: #f5c200;
}

.stars-large {
  font-size: 18px;
}

/* ============ 示例标记 ============ */
.sample-chip {
  display: inline-flex;
  align-items: center;
  font: 600 10px/1 var(--font-family);
  color: #f5c200;
  background: rgba(245, 194, 0, 0.14);
  padding: 4px 7px;
  border-radius: var(--radius-button);
  flex-shrink: 0;
}

.sample-note {
  font: 400 11px/1.4 var(--font-family);
  color: var(--text-tertiary);
  margin-top: 8px;
}

/* ============ 截图 ============ */
.section {
  padding-top: 30px;
}

.section-title {
  font: 700 22px/1.2 var(--font-family);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-head .section-title {
  margin-bottom: 0;
}

.shot-viewport {
  overflow: hidden;
  /* 横滑带两端渐隐，暗示还有内容 */
  mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 32px), transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 32px), transparent 100%);
}

.shot-rail {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 2px 20px 8px 2px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.shot-rail::-webkit-scrollbar {
  display: none;
}

.shot {
  flex-shrink: 0;
  margin: 0;
  scroll-snap-align: start;
}

.shot img {
  display: block;
  height: 380px;
  width: auto;
  border-radius: var(--radius-large);
  background: var(--bg-card);
  box-shadow: var(--shadow-small);
}

.shot-label {
  margin-top: 6px;
  font: 400 11px/1.3 var(--font-family);
  color: var(--text-tertiary);
}

/* ============ 简介 ============ */
.description {
  font: var(--text-body);
  color: var(--text-primary);
  line-height: 1.7;
  max-width: 760px;
}

.description.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more-btn {
  margin-top: 6px;
  font: 600 13px/1 var(--font-family);
  color: var(--key-color);
}

/* ============ 信息表 ============ */
.info-table {
  border-radius: var(--radius-large);
  background: var(--bg-card);
  padding: 4px 18px;
  max-width: 760px;
}

.info-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 10px 0;
}

.info-row + .info-row {
  border-top: 0.5px solid var(--bg-elevated);
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

/* ============ 评分与评论 ============ */
.rating-card {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 24px;
  padding: 20px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
}

.rating-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding-top: 4px;
}

.rating-big {
  font: 800 54px/1 var(--font-family);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.rating-count {
  font: 400 12px/1.3 var(--font-family);
  color: var(--text-secondary);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review + .review {
  padding-top: 16px;
  border-top: 0.5px solid var(--bg-elevated);
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-author {
  font: 600 13px/1.3 var(--font-family);
  color: var(--text-primary);
}

.review-date {
  font: 400 11px/1.3 var(--font-family);
  color: var(--text-tertiary);
}

.review-stars {
  margin-top: 4px;
}

.review-title {
  font: 600 14px/1.4 var(--font-family);
  color: var(--text-primary);
  margin-top: 5px;
}

.review-text {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.55;
  margin-top: 2px;
}

/* ============ 章节目录 ============ */
.chapters-note {
  font: var(--text-footnote);
  color: var(--text-secondary);
  margin: -4px 0 14px;
}

.chapters-note-extra {
  margin-top: -8px;
  color: var(--text-tertiary);
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

.volume-missing {
  margin-left: auto;
  flex-shrink: 0;
  font: 600 11px/1 var(--font-family);
  color: var(--text-tertiary);
  background: rgba(118, 118, 128, 0.18);
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

/* ============ 版本历史 ============ */
.history {
  border-radius: var(--radius-large);
  background: var(--bg-card);
  padding: 4px 18px;
  list-style: none;
}

.history-item {
  padding: 14px 0;
}

.history-item + .history-item {
  border-top: 0.5px solid var(--bg-elevated);
}

.history-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.history-version {
  font: 600 14px/1.3 var(--font-family);
  color: var(--text-primary);
}

.history-date {
  font: 400 11px/1.3 var(--font-family);
  color: var(--text-tertiary);
}

.history-notes {
  margin-top: 6px;
  padding-left: 16px;
  list-style: disc;
}

.history-note {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.5;
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
  line-height: 1.6;
}

.open-text strong {
  color: var(--text-primary);
}

.open-text a {
  color: var(--key-color);
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
  .hero-content {
    grid-template-columns: 110px 1fr;
    gap: 18px;
    padding: 24px 20px 20px;
  }

  .hero-icon {
    width: 110px;
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

  .rating-card {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .rating-summary {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }

  .rating-big {
    font-size: 40px;
  }

  .shot img {
    height: 300px;
  }
}

@media (max-width: 599px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-icon {
    width: 104px;
  }

  .title {
    font-size: 25px;
  }

  .shot img {
    height: 240px;
  }

  .info-row {
    grid-template-columns: 86px 1fr;
    gap: 12px;
  }

  .volume-head {
    flex-wrap: wrap;
    gap: 8px 10px;
  }

  .volume-packed {
    margin-left: 0;
  }

  .volume-missing {
    margin-left: 0;
  }

  .section-title {
    font-size: 20px;
  }
}
</style>
