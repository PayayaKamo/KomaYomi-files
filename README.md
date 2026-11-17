# KomaYomi Files

**English** | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

A fully static storefront for KomaYomi `.mnproj` manga projects. It currently lists three
titles: *Is the Order a Rabbit?* (Gochuumon wa Usagi desu ka?), *Yuru Yuri*, and *Oomuro-ke*.
Each title maps to one `.mnproj` project file. Download the file and open it with the
[KomaYomi desktop app](https://github.com/PayayaKamo/KomaYomi) or the
[mobile app](https://github.com/PayayaKamo/KomaYomi-mobile) to start reading.

- Repository: <https://github.com/PayayaKamo/KomaYomi-files>
- The UI follows an Apple App Store-inspired design language (tokens.css / SidebarNav /
  PosterCard / SectionHeader / PillButton / Artwork / HorizontalShelf).

## Tech Stack

- Vue 3.5 + TypeScript + Vue Router 4
- Built with Vite 6; the output is fully static

## Pages and Routes

| Route | Page |
|-------|------|
| `/store` | Title shelf: editor's pick poster cards for all three titles, category tabs, featured collection rails, charts, and all titles. `?q=` filters by title, original name, author, or tag. |
| `/titles/:slug` | Title detail: hero artwork and icon, primary download button, screenshot rail, summary, information table, ratings and reviews (sample), volume-by-volume collapsible chapter list, version history. |
| `/guide` | Usage guide: what `.mnproj` is, platform links, FAQ. |
| `/` | Redirects to `/store`. |

Download buttons are only enabled after a title pack has been published; until then they show
"准备中" (preparing) and are disabled. Ratings, reviews, charts, collections, and editor's pick
copy on the site are sample content and are labeled as such in the UI.

## Data Maintenance

The single source of truth is [src/data/titles.ts](src/data/titles.ts); types live in
[src/types/title.ts](src/types/title.ts).

### Title Metadata

Name, original name, romaji, author, status, summary, tags, and accent color.

### Volumes and Chapters

`volumes[].chapters[]` records chapter numbers, and `packed: true` marks the chapters that are
actually included in the current `.mnproj`. Unverified chapter titles are not written; the UI
shows chapter numbers only.

### Publishing a Pack

1. Put the file at `public/packs/<slug>.mnproj` (for example,
   `public/packs/gochiusa-14.mnproj`).
2. Set the matching `pack.status` to `'available'` and fill in the real `sizeLabel`
   (for example, `'24.6 MB'`).

After that, download entries appear automatically on the detail page and poster cards; no
component changes are needed.

### Cover Artwork

`public/covers/<slug>.jpg`, extracted from page images in `demo-project.mnproj`. Covers are
800px wide and kept under 300KB each.

## Development and Build

```bash
npm install
npm run dev        # http://localhost:5273
npm run build      # vue-tsc type check + vite build
npm run preview
```

## Deployment

`dist/` can be hosted on any static server. Because the app uses history routing, unknown
paths must fall back to `index.html` (see the `try_files` setup in [nginx.conf](nginx.conf)).

### GitHub Pages

The repository includes [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which
builds and publishes the site to GitHub Pages on every push to `main`.

- URL: <https://payayakamo.github.io/KomaYomi-files/>
- The project site lives under the `/KomaYomi-files/` subpath. The workflow injects the base
  through `VITE_BASE`, and both Vite assets and the vue-router history use that same base.
- After the build, `dist/index.html` is copied to `dist/404.html` so deep links such as title
  detail pages still load.
- On the first deployment, set Settings → Pages → Source to **GitHub Actions**
  (GITHUB_TOKEN cannot create a Pages site, so it must be enabled manually once).

### Deploying Elsewhere

Keep the default root base when deploying to another machine:

```bash
npm run build          # base is /
# If the site is served from a subpath, pass the base explicitly
VITE_BASE=/sub-path/ npm run build
```
