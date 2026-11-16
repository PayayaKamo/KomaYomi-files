/**
 * 作品商店唯一数据源 —— 三部作品的卷/话结构与 .mnproj 上架状态都在这里维护。
 *
 * 章节数据说明：
 *  - 点兔第 14 卷：Ch.172–184（13 话），打包文件里实际只有 Ch.172。
 *  - 摇曳百合第 24 卷：Ch.199 起，区间按连载进度填写，实际只收录 Ch.199。
 *  - 大室家第 8 卷：Ch.106 起，同上，实际只收录 Ch.106。
 *  未核实的章节标题一律不写，界面只显示话号。
 *
 * 上架方式：把 <slug>.mnproj 放进 public/packs/，再把对应 pack 的
 * status 改为 'available'、填上 sizeLabel 即可，页面会自动出现下载按钮。
 */
import type { ChapterRef, FeaturedCard, Title } from '../types/title'
import { PALETTE } from '../types/title'

export const siteName = 'KomaYomi 商店'

export const KOMAYOMI_LINKS = {
  desktop: 'https://github.com/PayayaKamo/KomaYomi',
  mobile: 'https://github.com/PayayaKamo/KomaYomi-mobile',
  docs: 'https://payayakamo.github.io/KomaYomi-docs/',
  online: 'https://github.com/PayayaKamo/KomaYomi-online',
} as const

/** 生成连续话号，packed 列出当前包内实际收录的话 */
function chapters(from: number, to: number, packed: number[]): ChapterRef[] {
  return Array.from({ length: to - from + 1 }, (_, i) => {
    const number = from + i
    return packed.includes(number) ? { number, packed: true } : { number }
  })
}

export const titles: Title[] = [
  {
    slug: 'gochiusa',
    name: '点兔',
    originalName: 'ご注文はうさぎですか？',
    romaji: 'Gochuumon wa Usagi desu ka?',
    author: 'Koi',
    status: '连载中',
    summary:
      '心爱搬到小镇读书，误打误撞住进 Rabbit House 咖啡店，与智乃、理世、千夜、纱路一起度过的咖啡店日常。第 14 卷延续四格短篇的节奏，圣诞季的小故事居多，台词轻快，适合三语对照精读。',
    tags: ['四格', '日常', '百合', '咖啡店'],
    cover: '/covers/gochiusa-14.jpg',
    accentColor: PALETTE.orange,
    sourceUrl:
      'https://mangadex.org/title/c02343b3-74e4-4057-b34a-90e08d93f95a/gochuumon-wa-usagi-desu-ka',
    pack: {
      file: 'packs/gochiusa-14.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.172 · 8 页 × 3 语',
    },
    volumes: [{ number: 14, chapters: chapters(172, 184, [172]) }],
  },
  {
    slug: 'yuruyuri',
    name: '摇曳百合',
    originalName: 'ゆるゆり',
    romaji: 'Yuru Yuri',
    author: 'なもり',
    status: '连载中',
    summary:
      '废部边缘的娱乐部里，赤座灯里、岁纳京子、船见结衣、吉川千夏的放学后永远不会结束。第 24 卷仍然是四格短篇合集，对话密度高，适合逐句对照阅读。',
    tags: ['四格', '日常', '百合', '校园'],
    cover: '/covers/yuruyuri-24.jpg',
    accentColor: PALETTE.pink,
    sourceUrl: 'https://mangadex.org/title/6306c976-d776-48c3-b29f-d345e65f272b/yuru-yuri',
    pack: {
      file: 'packs/yuruyuri-24.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.199 · 14 页 × 3 语',
    },
    volumes: [{ number: 24, chapters: chapters(199, 206, [199]) }],
  },
  {
    slug: 'oomuroke',
    name: '大室家',
    originalName: '大室家',
    romaji: 'Oomuro-ke',
    author: 'なもり',
    status: '连载中',
    summary:
      '《摇曳百合》的外传，主角换成大室家三姐妹：樱子、抚子与花子。第 8 卷继续以短篇串联三姐妹的日常，节奏比本篇更松散，适合随手翻读。',
    tags: ['四格', '日常', '百合', '外传'],
    cover: '/covers/oomuroke-08.jpg',
    accentColor: PALETTE.purple,
    sourceUrl:
      'https://mangadex.org/title/9ad4148b-8c9e-48d5-89ec-e7b98a660e42/oomuro-ke',
    pack: {
      file: 'packs/oomuroke-08.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.106 · 8 页 × 3 语',
    },
    volumes: [{ number: 8, chapters: chapters(106, 114, [106]) }],
  },
]

/** 首页大卡内容，按数组顺序渲染 */
export const featuredCards: FeaturedCard[] = [
  {
    id: 'featured-gochiusa',
    slug: 'gochiusa',
    heading: '今日推荐',
    title: '点兔 · 第 14 卷',
    tagline: '圣诞灯饰下的 Rabbit House，三语对照的四格日常。',
    accentColor: PALETTE.orange,
    style: 'light',
    mediaImage: '/covers/gochiusa-14.jpg',
    name: '点兔',
    subtitle: '第 14 卷 · Ch.172–184',
    iconImage: '/covers/gochiusa-14.jpg',
  },
  {
    id: 'featured-yuruyuri',
    slug: 'yuruyuri',
    heading: '编辑精选',
    title: '摇曳百合 · 第 24 卷',
    tagline: '娱乐部的放学后还在继续，第 199 话起的短篇合集。',
    accentColor: PALETTE.pink,
    style: 'light',
    mediaImage: '/covers/yuruyuri-24.jpg',
    name: '摇曳百合',
    subtitle: '第 24 卷 · Ch.199 起',
    iconImage: '/covers/yuruyuri-24.jpg',
  },
]

/** 某卷的话号区间，如 'Ch.172–184' */
export function chapterRange(volume: { chapters: ChapterRef[] }): string {
  if (!volume.chapters.length) return ''
  const first = volume.chapters[0].number
  const last = volume.chapters[volume.chapters.length - 1].number
  return first === last ? `Ch.${first}` : `Ch.${first}–${last}`
}

/** 作品总话数（数据内已收录的卷合计） */
export function totalChapters(title: Title): number {
  return title.volumes.reduce((sum, v) => sum + v.chapters.length, 0)
}

/** 包内实际收录的话数 */
export function packedChapters(title: Title): number {
  return title.volumes.reduce(
    (sum, v) => sum + v.chapters.filter((c) => c.packed).length,
    0,
  )
}

/** 海报卡副标题：第 N 卷 · N 话 · 下载状态 */
export function titleSubtitle(title: Title): string {
  const volume = title.volumes[title.volumes.length - 1]
  const parts = [`第 ${volume.number} 卷`, `${totalChapters(title)} 话`]
  parts.push(title.pack.status === 'available' ? title.pack.sizeLabel : '下载准备中')
  return parts.join(' · ')
}

export function findTitle(slug: string): Title | undefined {
  return titles.find((t) => t.slug === slug)
}
