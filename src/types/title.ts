/** 作品商店数据模型 —— 下载单元为 KomaYomi 的 .mnproj 工程文件 */

/** 单话（只记录话号，未核实的章节标题不编造） */
export interface ChapterRef {
  number: number
  /** 当前 .mnproj 包内实际收录该话 */
  packed?: boolean
}

/** 单卷及其章节列表 */
export interface VolumeRef {
  number: number
  chapters: ChapterRef[]
}

/** 作品包状态：preparing 未上架（按钮禁用）/ available 可下载 */
export type PackStatus = 'preparing' | 'available'

export interface PackInfo {
  /** public 下的相对路径，例如 'packs/gochiusa-14.mnproj' */
  file: string
  status: PackStatus
  /** 展示用体量；未上架时为 '—' */
  sizeLabel: string
  /** 包内实际内容说明，例如 'Ch.172 · 8 页 × 3 语' */
  contents: string
}

/** 作品 */
export interface Title {
  /** 路由与封面/pack 文件名使用的短标识 */
  slug: string
  name: string
  originalName: string
  romaji: string
  author: string
  status: '连载中' | '已完结'
  summary: string
  tags: string[]
  /** 封面图（public/covers 下的路径） */
  cover: string
  /** 详情页主题色 / 占位色 */
  accentColor: string
  /** 作品来源页（MangaDex） */
  sourceUrl: string
  pack: PackInfo
  volumes: VolumeRef[]
}

/** 首页大卡（沿用 App Store TodayCard 的视觉结构） */
export interface FeaturedCard {
  id: string
  /** 指向的作品 slug */
  slug: string
  /** 角标，如「今日推荐」 */
  heading: string
  title: string
  tagline: string
  accentColor: string
  style: 'light' | 'white'
  mediaImage: string | null
  /** 底部 lockup 展示的作品名 */
  name: string
  subtitle: string
  /** lockup 小图，缺省沿用 mediaImage */
  iconImage: string | null
}

/** 占位图主题色色板（沿用苹果系统色） */
export const PALETTE = {
  green: '#34c759',
  blue: '#0a84ff',
  purple: '#7d55c7',
  indigo: '#5856d6',
  orange: '#ff9500',
  pink: '#ff2d55',
  teal: '#00c7be',
  yellow: '#f5c200',
} as const
