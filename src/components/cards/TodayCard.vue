<script setup lang="ts">
/**
 * TodayCard —— 沿用 App Store TodayCard 的视觉结构：
 *  - accent 主色背景 + 媒体图 + 底部信息层
 *  - 毛玻璃保护层：backdrop-filter blur(34px) + mask 渐隐（苹果原值）
 *  - 渐变层：linear-gradient(0deg) + color-mix 60% 中间停靠点
 *  - hover 渐变加深（93% 混黑）
 *  - container query：卡片宽高比 ≥16/9 时渐变停靠点下移
 *  - 底部 lockup：作品封面 + 名称 + 副标题 + 查看胶囊
 */
import type { FeaturedCard } from '../../types/title'
import Artwork from '../media/Artwork.vue'
import PillButton from '../ui/PillButton.vue'

defineProps<{ card: FeaturedCard; nolink?: boolean }>()
</script>

<template>
  <!-- nolink 模式：详情页关联卡，不渲染为链接、不显示 View 按钮 -->
  <div v-if="nolink" class="card-link card-link-static">
    <div
      class="today-card"
      :class="card.style"
      :style="{ '--today-card-accent-color': card.accentColor }"
    >
      <div class="media">
        <Artwork :image="card.mediaImage" :label="card.title" :accent-color="card.accentColor" />
      </div>
      <div class="information-layer with-gradient">
        <div class="title-container">
          <p class="badge">{{ card.heading }}</p>
          <h3 class="title">{{ card.title }}</h3>
          <p class="description">{{ card.tagline }}</p>
        </div>
        <div class="overlay">
          <Artwork
            :image="card.iconImage ?? card.mediaImage"
            :label="card.name"
            :accent-color="card.accentColor"
            class="lockup-icon"
          />
          <div class="lockup-text">
            <span class="lockup-name">{{ card.name }}</span>
            <span class="lockup-subtitle">{{ card.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <RouterLink v-else :to="`/titles/${card.slug}`" class="card-link">
    <div
      class="today-card"
      :class="card.style"
      :style="{ '--today-card-accent-color': card.accentColor }"
    >
      <!-- 媒体层（占位块或封面图） -->
      <div class="media">
        <Artwork :image="card.mediaImage" :label="card.title" :accent-color="card.accentColor" />
      </div>

      <!-- 信息层：整卡高度的底部渐变 + 角标/标题/描述 + 毛玻璃 lockup 条（同苹果 DOM 结构） -->
      <div class="information-layer with-gradient">
        <div class="title-container">
          <p class="badge">{{ card.heading }}</p>
          <h3 class="title">{{ card.title }}</h3>
          <p class="description">{{ card.tagline }}</p>
        </div>

        <div class="overlay">
          <Artwork
            :image="card.iconImage ?? card.mediaImage"
            :label="card.name"
            :accent-color="card.accentColor"
            class="lockup-icon"
          />
          <div class="lockup-text">
            <span class="lockup-name">{{ card.name }}</span>
            <span class="lockup-subtitle">{{ card.subtitle }}</span>
          </div>
          <PillButton variant="gray">查看</PillButton>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card-link {
  display: block;
  width: 100%;
  height: 100%;
}

.card-link-static {
  cursor: default;
}

.today-card {
  --today-card-gutter: 16px;
  --today-card-border-radius: var(--radius-large);
  --gradient-color: var(--today-card-accent-color);
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--today-card-border-radius);
  background-color: var(--today-card-accent-color);
  color: #fff;
  container-type: size;
  container-name: today-card;
  box-shadow: var(--shadow-small);
}

/* light（白字，用于彩色/深色卡）与 white（黑字）两种风格，同泄露码 */
.today-card.light {
  --today-card-text-color: rgb(255, 255, 255);
  --today-card-text-accent-color: rgba(255, 255, 255, 0.56);
  --today-card-text-accent-blend-mode: plus-lighter;
}

.today-card.white {
  --today-card-text-color: rgb(0, 0, 0);
  --today-card-text-accent-color: rgba(0, 0, 0, 0.56);
  --today-card-text-accent-blend-mode: normal;
}

.media {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
}

.information-layer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  /* 渐变：底部实色 → 60% 透明中间停靠 → 顶部全透明（苹果原值） */
  --gradient-color-end-position: 22%;
  --gradient-fade-end-position: 50%;
  background: linear-gradient(
    0deg,
    var(--gradient-color) var(--gradient-color-end-position),
    color-mix(in srgb, var(--gradient-color) 60%, transparent)
      calc(
        (var(--gradient-color-end-position) + var(--gradient-fade-end-position)) / 2
      ),
    transparent var(--gradient-fade-end-position)
  );
  transition: --gradient-color 350ms ease-out;
}

/* hover：渐变色 93% 混黑（苹果原值） */
.card-link:hover .information-layer {
  --gradient-color: color-mix(in srgb, var(--today-card-accent-color) 93%, black);
}

/* 卡片宽高比 ≥16/9 时渐变停靠点从 22% 下移到 30%（苹果 container query 原逻辑） */
@container today-card (aspect-ratio >= 16/9) {
  .information-layer {
    --gradient-color-end-position: 30%;
  }
}

.title-container {
  position: relative;
  padding: 0 var(--today-card-gutter) var(--today-card-gutter);
}

.badge {
  font: var(--text-callout);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  mix-blend-mode: var(--today-card-text-accent-blend-mode);
  color: var(--today-card-text-accent-color);
}

.title {
  font: var(--text-card-title);
  color: var(--today-card-text-color);
  text-wrap: pretty;
}

.description {
  font: var(--text-body);
  padding-top: 8px;
  mix-blend-mode: var(--today-card-text-accent-blend-mode);
  color: var(--today-card-text-accent-color);
  position: relative;
  z-index: 1;
}

/* 底部 lockup（对应 TodayCardOverlay）：毛玻璃条 */
.overlay {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: var(--today-card-gutter);
  backdrop-filter: blur(50px);
  background-image: linear-gradient(rgba(0, 0, 0, 0.15) 0 0);
}

.lockup-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.lockup-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.lockup-name {
  font: var(--text-headline);
  color: var(--today-card-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lockup-subtitle {
  font: var(--text-footnote);
  color: var(--today-card-text-accent-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
