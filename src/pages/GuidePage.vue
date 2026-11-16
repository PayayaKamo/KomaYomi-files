<script setup lang="ts">
/** 使用指南 —— /guide：说明 .mnproj 与 KomaYomi 各端的关系及常见疑问 */
import { KOMAYOMI_LINKS } from '../data/titles'

const platforms = [
  {
    name: 'KomaYomi 桌面版',
    url: KOMAYOMI_LINKS.desktop,
    text: 'Electron 应用。启动后从「文件 → 打开工程」选择 .mnproj；保存会写回同一个工程文件。',
  },
  {
    name: 'KomaYomi 移动版',
    url: KOMAYOMI_LINKS.mobile,
    text: 'Android 应用。在库页面导入 .mnproj，界面与桌面版保持一致，四格对照阅读可用。',
  },
  {
    name: 'KomaYomi 在线版',
    url: KOMAYOMI_LINKS.online,
    text: '纯浏览器版本，导入 .mnproj 后数据保存在浏览器本地，不依赖服务端。',
  },
]

const faqs = [
  {
    q: '为什么下载按钮显示「准备中」？',
    a: '作品包尚未上架。上架后按钮会变成「下载 .mnproj」，当前不会跳转到空链接。',
  },
  {
    q: '下载后打不开怎么办？',
    a: '.mnproj 是 KomaYomi 的工程文件，不能直接用图片查看器或解压软件阅读。请安装 KomaYomi 后从应用内导入。',
  },
  {
    q: '章节标题为什么只有话号？',
    a: '未核实的章节标题不写入数据，避免编造。详情页只保证显示话号，以及包内实际收录的那一话。',
  },
  {
    q: '封面和页面素材来自哪里？',
    a: '封面取自示例工程内的页面图。作品内容版权归原作者与出版社所有。',
  },
]
</script>

<template>
  <div class="guide-page">
    <header class="page-header">
      <h1 class="page-title">使用指南</h1>
      <p class="page-lead">作品商店下载的是 .mnproj 工程文件，需要 KomaYomi 打开。</p>
    </header>

    <section class="section">
      <h2 class="section-title">什么是 .mnproj</h2>
      <p class="body-text">
        每部作品被打包为单个 .mnproj 工程，里面包含页面图片、分格数据、语言对照与笔记层。
        它不是一个可以直接双击阅读的 PDF：需要导入 KomaYomi，才能使用对照视图、切格工作台与笔记功能。
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">选择你的平台</h2>
      <div class="platform-grid">
        <a
          v-for="p in platforms"
          :key="p.name"
          class="platform-card"
          :href="p.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 class="platform-name">{{ p.name }} <span aria-hidden="true">↗</span></h3>
          <p class="platform-text">{{ p.text }}</p>
        </a>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">下载后怎么读</h2>
      <ol class="steps">
        <li class="step">打开作品详情页，点「下载 .mnproj」，记住文件保存位置。</li>
        <li class="step">启动 KomaYomi，从文件菜单或库页面导入该工程。</li>
        <li class="step">进入对照视图，按语言顺序并排查看日 / 中 / 英页面，随时添加笔记。</li>
      </ol>
      <RouterLink to="/store" class="back-link">回到作品商店</RouterLink>
    </section>

    <section class="section">
      <h2 class="section-title">常见问题</h2>
      <dl class="faq-list">
        <div v-for="f in faqs" :key="f.q" class="faq">
          <dt class="faq-q">{{ f.q }}</dt>
          <dd class="faq-a">{{ f.a }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.guide-page {
  padding: 18px var(--body-gutter) 60px;
  max-width: 900px;
}

.page-title {
  font: var(--text-page-title);
  color: var(--text-primary);
}

.page-lead {
  font: var(--text-body);
  color: var(--text-secondary);
  margin-top: 8px;
}

.section {
  padding-top: 30px;
}

.section-title {
  font: 700 22px/1.2 var(--font-family);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.body-text {
  font: var(--text-body);
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 720px;
}

.platform-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 800px) {
  .platform-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.platform-card {
  display: block;
  padding: 18px;
  border-radius: var(--radius-large);
  background: var(--bg-card);
  transition: background 0.15s ease;
}

.platform-card:hover {
  background: var(--bg-elevated);
}

.platform-name {
  font: var(--text-headline);
  color: var(--text-primary);
  margin-bottom: 6px;
}

.platform-name span {
  color: var(--key-color);
}

.platform-text {
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.5;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  counter-reset: step;
}

.step {
  position: relative;
  padding: 12px 16px 12px 44px;
  border-radius: 12px;
  background: var(--bg-card);
  font: var(--text-body);
  color: var(--text-primary);
  line-height: 1.5;
  counter-increment: step;
}

.step::before {
  content: counter(step);
  position: absolute;
  left: 14px;
  top: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(10, 132, 255, 0.15);
  color: var(--key-color);
  font: 700 12px/20px var(--font-family);
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  font: var(--text-headline);
  color: var(--key-color);
}

.faq-list {
  border-radius: var(--radius-large);
  background: var(--bg-card);
  padding: 4px 18px;
}

.faq {
  padding: 14px 0;
}

.faq + .faq {
  border-top: 0.5px solid var(--bg-elevated);
}

.faq-q {
  font: 600 15px/1.4 var(--font-family);
  color: var(--text-primary);
}

.faq-a {
  margin: 4px 0 0;
  font: var(--text-footnote);
  color: var(--text-secondary);
  line-height: 1.55;
}
</style>
