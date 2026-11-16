# KomaYomi Files

KomaYomi 的 `.mnproj` 作品商店，纯静态站点。当前上架点兔、摇曳百合、大室家三部作品，
每部作品对应一个 `.mnproj` 工程文件，下载后用 [KomaYomi](https://github.com/PayayaKamo/KomaYomi)
桌面版或 [移动版](https://github.com/PayayaKamo/KomaYomi-mobile) 打开即可阅读。

- 仓库：<https://github.com/PayayaKamo/KomaYomi-files>
- 视觉沿用苹果 App Store 式设计语言（tokens.css / SidebarNav / PosterCard / SectionHeader /
  PillButton / Artwork / HorizontalShelf / TodayCard）。

## 技术栈

- Vue 3.5 + TypeScript + Vue Router 4
- Vite 6 构建，产物为纯静态文件

## 页面与路由

| 路由 | 页面 |
|------|------|
| `/store` | 作品货架：精选大卡 + 全部作品横滑卡片，`?q=` 过滤作品名 / 原名 / 作者 / 标签 |
| `/titles/:slug` | 作品详情：作品信息、下载主按钮、按卷折叠的章节目录、来源外链 |
| `/guide` | 使用指南：什么是 `.mnproj`、各平台入口、常见问题 |
| `/` | 重定向到 `/store` |

下载按钮只在作品包上架后可用；未上架时显示「准备中」并禁用。

## 数据维护

唯一数据源：[src/data/titles.ts](src/data/titles.ts)，类型见
[src/types/title.ts](src/types/title.ts)。

- 作品信息：名称、原名、罗马字、作者、状态、简介、标签、来源页、主题色。
- 卷/话：`volumes[].chapters[]` 记录话号，`packed: true` 标出当前 `.mnproj` 内实际收录的话。
  未核实的章节标题不写入，页面只显示话号。
- 上架作品包：

  1. 把文件放到 `public/packs/<slug>.mnproj`（例如 `public/packs/gochiusa-14.mnproj`）；
  2. 把对应 `pack.status` 改为 `'available'`，并填写真实 `sizeLabel`（例如 `'24.6 MB'`）。

  改完后详情页与海报卡会自动出现下载入口，无需改组件。

- 封面：`public/covers/<slug>.jpg`，取自 `demo-project.mnproj` 的页面图，宽度 800px、
  单张控制在 300KB 以内。

## 开发与构建

```bash
npm install
npm run dev        # http://localhost:5273
npm run build      # vue-tsc 类型检查 + vite build
npm run preview
```

## 部署

`dist/` 可直接托管在任意静态服务器；使用 history 路由，需要把未知路径回退到
`index.html`（参考 [nginx.conf](nginx.conf) 的 `try_files` 配置）。
