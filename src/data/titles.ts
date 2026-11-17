/**
 * 作品商店唯一数据源 —— 三部作品的全卷话号结构与 .mnproj 上架状态都在这里维护。
 *
 * 章节数据说明：
 *  - 全卷目录按作品聚合数据整理，卷号、卷内话号（含小数话与半卷）照原始记录写入，
 *    未做任何推算；未核实的章节标题一律不写，界面只显示话号。
 *  - 点兔：Vol.1–14，本包收录 Vol.14 的 Ch.172；第 1–8 卷的话号为卷内编号，
 *    第 9 卷起为连续话号，两段编号不衔接，界面有对应说明。
 *  - 摇曳百合：Vol.1–24 与 Vol.10.5，本包收录 Vol.24 的 Ch.199。
 *  - 大室家：Vol.1–8 与 Vol.2.5，本包收录 Vol.8 的 Ch.106。
 *  - 聚合数据中另有未编卷的话，未列入上方卷目录。
 *
 * 上架方式：把 <slug>.mnproj 放进 public/packs/，再把对应 pack 的
 * status 改为 'available'、填上 sizeLabel 即可，页面会自动出现下载按钮。
 */
import type {
  ChapterRef,
  ChartSort,
  Collection,
  FeaturedCard,
  Title,
  VolumeRef,
} from '../types/title'
import { PALETTE } from '../types/title'

export const siteName = 'KomaYomi 商店'

/** 拼上部署 base，保证子路径部署时封面、截图等静态资源可用 */
function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}

export const KOMAYOMI_LINKS = {
  desktop: 'https://github.com/PayayaKamo/KomaYomi',
  mobile: 'https://github.com/PayayaKamo/KomaYomi-mobile',
  docs: 'https://payayakamo.github.io/KomaYomi-docs/',
  online: 'https://github.com/PayayaKamo/KomaYomi-online',
} as const

/** 解析话号描述：'1-13' 为连续区间，'9.5' 为单话，逗号分隔 */
function chapters(spec: string, packed: string[] = []): ChapterRef[] {
  const numbers: string[] = []
  for (const token of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [from, to] = token.split('-')
    if (to === undefined) {
      numbers.push(from)
      continue
    }
    for (let n = Number(from); n <= Number(to); n += 1) {
      numbers.push(String(n))
    }
  }
  return numbers.map((number) =>
    packed.includes(number) ? { number, packed: true } : { number },
  )
}

/** 单卷：卷号 + 话号描述 */
function volume(number: string, spec: string, packed: string[] = []): VolumeRef {
  return { number, chapters: chapters(spec, packed) }
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
    chapterNote:
      '第 1–8 卷的话号按卷内编号记录，第 9 卷起为连续话号，两段编号不衔接，均照原始数据展示。',
    cover: asset('covers/gochiusa-14.jpg'),
    accentColor: PALETTE.orange,
    pack: {
      file: 'packs/gochiusa-14.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.172 · 8 页 × 3 语',
    },
    volumes: [
      volume('1', '0-14'),
      volume('2', '1-14'),
      volume('3', '1-9,9.5,10-12'),
      volume('4', '0-14'),
      volume('5', '1-13'),
      volume('6', '1-13'),
      volume('7', '1-13'),
      volume('8', '1-13'),
      volume('9', '107-119'),
      volume('10', '120-132,132.1'),
      volume('11', '133-145'),
      volume('12', '146-158'),
      volume('13', '159-171'),
      volume('14', '172-184', ['172']),
    ],
    isNew: true,
    store: {
      developer: 'Koi / 芳文社',
      version: '1.0.0',
      updatedAt: '2026-11-10',
      rating: 4.8,
      ratingCount: 126,
      popularity: 9800,
      estimatedSizeMb: 28.6,
      screenshots: [
        { src: asset('screenshots/gochiusa-1.jpg'), label: '第 172 话 · 内页 1' },
        { src: asset('screenshots/gochiusa-2.jpg'), label: '第 172 话 · 内页 2' },
        { src: asset('screenshots/gochiusa-3.jpg'), label: '第 172 话 · 内页 3' },
      ],
      reviews: [
        {
          author: '示例读者 A',
          rating: 5,
          date: '2026-11-11',
          title: '三语对照很省事',
          text: '同一页并排放着日文、中文和英文，生词可以直接在格子里记笔记，不用来回切窗口。',
        },
        {
          author: '示例读者 B',
          rating: 4,
          date: '2026-11-09',
          title: '适合片段精读',
          text: '四格每话都很短，通勤时挑一话读完刚好。希望后续能把整卷补齐。',
        },
      ],
      changelog: [
        {
          version: '1.0.0',
          date: '2026-11-10',
          notes: [
            '首次打包第 14 卷 Ch.172',
            '日 / 中 / 英三语页面',
            '内置分格检测结果与页面偏移',
          ],
        },
      ],
    },
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
    cover: asset('covers/yuruyuri-24.jpg'),
    accentColor: PALETTE.pink,
    pack: {
      file: 'packs/yuruyuri-24.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.199 · 14 页 × 3 语',
    },
    volumes: [
      volume('1', '1-8,8.5,9-12,12.1,12.2'),
      volume('2', '13-22,22.1,22.2'),
      volume('3', '22.3,23-32,32.1,32.2'),
      volume('4', '33-43,43.5,43.8'),
      volume('5', '44-51,51.01,51.02,51.025'),
      volume('6', '51.03-51.11,52'),
      volume('7', '52.1-52.8,52.85,52.86,52.87'),
      volume('8', '52.9,53-61'),
      volume('9', '61.1-61.9'),
      volume('10', '62-70,70.1'),
      volume('10.5', '70.2-70.9'),
      volume('11', '71-78,78.5-78.9'),
      volume('12', '79-88,88.5'),
      volume('13', '89-98,98.5'),
      volume('14', '99-108,108.5,108.8'),
      volume('15', '109-118,118.5,118.8'),
      volume('16', '119-128,128.5,128.8'),
      volume('17', '129-138,138.5,138.8'),
      volume('18', '139-148,148.5,148.8'),
      volume('19', '149-158,158.5,158.8'),
      volume('20', '159-168,168.5,168.8'),
      volume('21', '169-178,178.5,178.6'),
      volume('22', '179-188,188.5,188.6'),
      volume('23', '189-198,198.5,198.6'),
      volume('24', '199-208,208.5,208.6', ['199']),
    ],
    isNew: true,
    store: {
      developer: 'なもり / 一迅社',
      version: '1.0.0',
      updatedAt: '2026-11-08',
      rating: 4.7,
      ratingCount: 98,
      popularity: 8600,
      estimatedSizeMb: 31.2,
      screenshots: [
        { src: asset('screenshots/yuruyuri-1.jpg'), label: '第 199 话 · 内页 1' },
        { src: asset('screenshots/yuruyuri-2.jpg'), label: '第 199 话 · 内页 2' },
        { src: asset('screenshots/yuruyuri-3.jpg'), label: '第 199 话 · 内页 3' },
      ],
      reviews: [
        {
          author: '示例读者 C',
          rating: 5,
          date: '2026-11-09',
          title: '对话密度高，适合练阅读',
          text: '四格里对话很多，对照着看能顺便记下不少口语表达。',
        },
        {
          author: '示例读者 D',
          rating: 4,
          date: '2026-11-07',
          title: '希望补齐前面的卷',
          text: '这一包只到第 199 话，先当作试读，期待后续按卷上架。',
        },
      ],
      changelog: [
        {
          version: '1.0.0',
          date: '2026-11-08',
          notes: ['首次打包第 24 卷 Ch.199', '日 / 中 / 英三语页面', '含分格检测与标注层'],
        },
      ],
    },
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
    cover: asset('covers/oomuroke-08.jpg'),
    accentColor: PALETTE.purple,
    pack: {
      file: 'packs/oomuroke-08.mnproj',
      status: 'preparing',
      sizeLabel: '—',
      contents: 'Ch.106 · 8 页 × 3 语',
    },
    volumes: [
      volume('1', '1-19,19.5'),
      volume('2', '20-36,36.5'),
      volume('2.5', '37-49'),
      volume('3', '50-55,55.5'),
      volume('4', '56-66,66.5'),
      volume('5', '67-79'),
      volume('6', '80-92,92.5'),
      volume('7', '93,93.5,94-105,105.1'),
      volume('8', '106-116', ['106']),
    ],
    isNew: false,
    store: {
      developer: 'なもり / 一迅社',
      version: '1.0.0',
      updatedAt: '2026-11-06',
      rating: 4.6,
      ratingCount: 74,
      popularity: 7200,
      estimatedSizeMb: 19.4,
      screenshots: [
        { src: asset('screenshots/oomuroke-1.jpg'), label: '第 106 话 · 内页 1' },
        { src: asset('screenshots/oomuroke-2.jpg'), label: '第 106 话 · 内页 2' },
        { src: asset('screenshots/oomuroke-3.jpg'), label: '第 106 话 · 内页 3' },
      ],
      reviews: [
        {
          author: '示例读者 E',
          rating: 5,
          date: '2026-11-06',
          title: '外传读起来更松弛',
          text: '三姐妹的短篇节奏很舒服，一话一话翻过去没有负担。',
        },
        {
          author: '示例读者 F',
          rating: 4,
          date: '2026-11-05',
          title: '和本篇一起收',
          text: '和《摇曳百合》的本篇工程放在同一个库里，切换很方便。',
        },
      ],
      changelog: [
        {
          version: '1.0.0',
          date: '2026-11-06',
          notes: ['首次打包第 8 卷 Ch.106', '日 / 中 / 英三语页面', '内置分格检测结果'],
        },
      ],
    },
  },
]

/** 首页「编辑精选」小卡，按数组顺序渲染（三部作品统一小卡） */
export const featuredCards: FeaturedCard[] = [
  {
    id: 'featured-gochiusa',
    slug: 'gochiusa',
    heading: '编辑精选',
    blurb: '圣诞灯饰下的 Rabbit House，三语对照的四格日常。',
    name: '点兔',
    subtitle: '第 14 卷 · Ch.172–184',
  },
  {
    id: 'featured-yuruyuri',
    slug: 'yuruyuri',
    heading: '编辑精选',
    blurb: '娱乐部的放学后还在继续，第 199 话起的短篇合集。',
    name: '摇曳百合',
    subtitle: '第 24 卷 · Ch.199–208.6',
  },
  {
    id: 'featured-oomuroke',
    slug: 'oomuroke',
    heading: '编辑精选',
    blurb: '外传里的三姐妹，短篇节奏比本篇更松弛。',
    name: '大室家',
    subtitle: '第 8 卷 · Ch.106–116',
  },
]

/** 首页分类标签（new 走 isNew 标记，其余匹配作品 tags） */
export const categories: { id: string; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: '四格', label: '四格' },
  { id: '日常', label: '日常' },
  { id: '百合', label: '百合' },
  { id: 'new', label: '新上架' },
]

/** 精选合集：首页按合集分批展示同一批作品 */
export const collections: Collection[] = [
  {
    id: 'starter-yonkoma',
    title: '适合入门的四格日常',
    subtitle: '示例合集 · 每话独立成篇，从任意一话开始都不突兀',
    slugs: ['gochiusa', 'yuruyuri'],
  },
  {
    id: 'by-volume',
    title: '按卷收藏',
    subtitle: '示例合集 · 以单卷为单位的 .mnproj 工程，方便补齐书柜',
    slugs: ['gochiusa', 'yuruyuri', 'oomuroke'],
  },
  {
    id: 'oomuro-and-friends',
    title: '大室家与它的邻居们',
    subtitle: '示例合集 · 外传与本篇放在一起读',
    slugs: ['oomuroke', 'yuruyuri'],
  },
]

export const chartSortOptions: { value: ChartSort; label: string }[] = [
  { value: 'popularity', label: '热门下载' },
  { value: 'chapters', label: '按话数' },
  { value: 'size', label: '按体量' },
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

/** 展示用体量：已上架取真实体量，未上架给出示例估算 */
export function displaySize(title: Title): string {
  return title.pack.status === 'available'
    ? title.pack.sizeLabel
    : `约 ${title.store.estimatedSizeMb.toFixed(1)} MB（示例）`
}

/** 榜单行副标题 */
export function chartSubtitle(title: Title): string {
  return `★ ${title.store.rating.toFixed(1)} · ${totalChapters(title)} 话 · ${displaySize(title)}`
}

export function findTitle(slug: string): Title | undefined {
  return titles.find((t) => t.slug === slug)
}
