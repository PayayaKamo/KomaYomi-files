<script setup lang="ts">
/**
 * HorizontalShelf —— 横滑轨道 + 栏目头（对应 Shelf/Wrapper + HorizontalShelf）
 */
import SectionHeader from '../ui/SectionHeader.vue'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="shelf">
    <SectionHeader :title="title" :subtitle="subtitle" />
    <div class="track">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.shelf {
  padding-bottom: 32px;
}

.track {
  display: flex;
  overflow-x: auto;
  padding: 4px 0 8px;
  scroll-snap-type: x proximity;
  /* 让 snap 起点对齐 body-gutter，避免首卡被 snap 拉到最左覆盖 ::before 占位 */
  scroll-padding-inline-start: var(--body-gutter);
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

/* overflow 容器的 padding 在内容溢出时会被覆盖，用伪元素占位留左右间距；
   去掉 flex gap 改用子元素 margin-right 控制 item 间距，避免伪元素参与 gap 计算 */
.track::before,
.track::after {
  content: '';
  flex: 0 0 var(--body-gutter);
}

.track > :deep(*) {
  scroll-snap-align: start;
  flex-shrink: 0;
  margin-right: 16px;
}
</style>
