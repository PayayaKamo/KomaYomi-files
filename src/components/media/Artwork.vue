<script setup lang="ts">
/**
 * Artwork 图片组件 —— 占位 / 远程图片双模式
 *  - image 有值：<img> 展示远程图（object-fit: cover）
 *  - image 为空：主题色占位块（accentColor 或默认绿），居中显示 label 首字符
 */
const props = defineProps<{
  image?: string | null
  label?: string
  /** 占位背景色（默认苹果绿） */
  accentColor?: string
}>()

const glyph = () => (props.label ?? '').trim().charAt(0)
</script>

<template>
  <img v-if="image" class="artwork" :src="image" :alt="label ?? ''" loading="lazy" />
  <div
    v-else
    class="artwork placeholder"
    :style="{ background: accentColor ?? 'var(--green)' }"
  >
    <span v-if="label" class="glyph">{{ glyph() }}</span>
  </div>
</template>

<style scoped>
.artwork {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.glyph {
  font-size: 28px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}
</style>
