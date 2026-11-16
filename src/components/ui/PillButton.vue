<script setup lang="ts">
/**
 * 胶囊按钮 —— 对应泄露码 Button.svelte 的 pillButton 风格
 * variant:
 *  - gray    半透明灰（深色卡上的 View/获取）
 *  - tint    主题蓝底 15% 透明（浅色背景上的获取）
 *  - primary 主题蓝实心（详情页头部大号 Get 按钮，对标 Apple App Store web）
 */
withDefaults(defineProps<{ variant?: 'gray' | 'tint' | 'primary' }>(), { variant: 'gray' })
</script>

<template>
  <span class="pill" :class="variant"><slot /></span>
</template>

<style scoped>
.pill {
  display: inline-block;
  font: 700 13px/1 var(--font-family);
  padding: 7px 16px;
  border-radius: var(--radius-button);
  white-space: nowrap;
}

.pill.gray {
  background: rgba(120, 120, 128, 0.36);
  color: #fff;
  backdrop-filter: blur(10px);
}

.pill.tint {
  background: rgba(10, 132, 255, 0.15);
  color: var(--key-color);
}

/* 详情页主按钮：蓝色实心、更高、更大字号 */
.pill.primary {
  background: var(--key-color);
  color: #fff;
  font: 700 17px/1 var(--font-family);
  padding: 14px 28px;
  min-width: 84px;
  text-align: center;
}
</style>
