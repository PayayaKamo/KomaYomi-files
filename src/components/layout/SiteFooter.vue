<script setup lang="ts">
/**
 * 站点页脚 —— 相关链接多列网格 + 版权说明。
 * KomaYomi 各端仓库、文档站与作品来源集中在这里维护。
 */
import { KOMAYOMI_LINKS } from '../../data/titles'

interface FooterLink {
  label: string
  url?: string
  to?: string
}

const LINK_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'KomaYomi',
    links: [
      { label: '桌面版 · GitHub', url: KOMAYOMI_LINKS.desktop },
      { label: '移动版 · GitHub', url: KOMAYOMI_LINKS.mobile },
      { label: '在线版 · GitHub', url: KOMAYOMI_LINKS.online },
    ],
  },
  {
    title: '文档与指南',
    links: [
      { label: '使用文档', url: KOMAYOMI_LINKS.docs },
      { label: '本站使用指南', to: '/guide' },
      { label: '作品商店', to: '/store' },
    ],
  },
  {
    title: '作品来源',
    links: [
      { label: 'MangaDex', url: 'https://mangadex.org/' },
    ],
  },
]

/** 每列最多展示的链接数；某组超出时拆成多列，组名只在首列显示 */
const MAX_PER_COLUMN = 3

const COLUMNS = LINK_GROUPS.flatMap((group) => {
  const cols: { title: string; showTitle: boolean; links: FooterLink[] }[] = []
  for (let i = 0; i < group.links.length; i += MAX_PER_COLUMN) {
    cols.push({
      title: group.title,
      showTitle: i === 0,
      links: group.links.slice(i, i + MAX_PER_COLUMN),
    })
  }
  return cols
})
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="links-grid">
        <div v-for="(col, ci) in COLUMNS" :key="col.title + ci" class="link-group">
          <div class="group-title">{{ col.showTitle ? col.title : '' }}</div>
          <ul class="group-links">
            <li v-for="link in col.links" :key="link.label">
              <RouterLink v-if="link.to" :to="link.to" class="group-link">
                {{ link.label }}
              </RouterLink>
              <a
                v-else
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group-link"
              >{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-note">
        本站提供自行打包的 .mnproj 示例工程，作品版权归原作者与出版社所有。
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 0.5px solid var(--bg-elevated);
  background: var(--bg);
  padding: 28px var(--body-gutter) 32px;
}

.footer-inner {
  max-width: var(--content-max);
}

.links-grid {
  /* 手机端：两列网格，成对排列不孤儿 */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 32px;
}

/* 桌面端：一行多列 */
@media (min-width: 768px) {
  .links-grid {
    grid-template-columns: repeat(3, auto);
    justify-content: start;
    gap: 24px 64px;
  }
}

.group-title {
  font: var(--text-callout);
  color: var(--text-secondary);
  margin-bottom: 10px;
  /* 续列标题占位，保证各列首行链接对齐 */
  min-height: 17px;
}

.group-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-link {
  font: var(--text-footnote);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.group-link:hover {
  color: var(--text-primary);
}

.footer-note {
  margin-top: 24px;
  font: 400 12px/1.5 var(--font-family);
  color: var(--text-tertiary);
}
</style>
