<script setup lang="ts">
/**
 * 栏目头 —— 移植泄露码 Shelf/Title.svelte：
 * 大标题（+ 可选灰色副标题 + "查看全部" chevron）
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="section-header">
    <div class="title-row">
      <h2 class="title">{{ title }}</h2>
      <a v-if="$slots.default" class="see-all" href="#">
        <slot />
        <svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.5 2.5 10 10l-7.5 7.5" />
        </svg>
      </a>
    </div>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-header {
  margin: 0 var(--body-gutter) 13px;
}

.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font: var(--text-shelf-title);
  color: var(--text-primary);
}

.subtitle {
  font: var(--text-footnote);
  color: var(--text-secondary);
  margin-top: 3px;
}

.see-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font: var(--text-headline);
  color: var(--text-secondary);
  padding-bottom: 2px;
}

.see-all svg {
  height: 12px;
  width: auto;
  transition: translate 0.21s ease-out;
}

.see-all:hover svg {
  translate: 1px 0;
}
</style>
