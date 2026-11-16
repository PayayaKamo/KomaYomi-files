/** 作品商店数据模型 —— 下载单元为 KomaYomi 的 .mnproj 工程文件 */

/** 单话（只记录话号，未核实的章节标题不编造） */
export interface ChapterRef {
  /** 话号，保留小数（如 '132.1'） */
  number: string
  /** 当前 .mnproj 包内实际收录该话 */
  packed?: boolean
}

/** 单卷及其章节列表 */
export interface VolumeRef {
  /** 卷号，保留半卷（如 '10.5'） */
  number: string
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
  /** 话号编排说明（仅在源数据编号不连续时填写） */
  chapterNote?: string
  /** 封面图（public/covers 下的路径） */
  cover: string
  /** 详情页主题色 / 占位色 */
  accentColor: string
  pack: PackInfo
  volumes: VolumeRef[]
  /** 是否出现在「新上架」分类（示例标记） */
  isNew: boolean
  /** 商店展示信息（评分、评论、版本历史均为示例数据） */
  store: StoreMeta
}

/** 详情页截图（作品内页图） */
export interface Screenshot {
  src: string
  label: string
}

/** 示例评论：作者名统一用「示例读者」前缀，避免被当成真实用户评价 */
export interface Review {
  author: string
  rating: number
  date: string
  title: string
  text: string
}

/** 示例版本历史 */
export interface ChangeEntry {
  version: string
  date: string
  notes: string[]
}

export interface StoreMeta {
  developer: string
  /** 作品包版本（示例） */
  version: string
  /** 更新时间（示例） */
  updatedAt: string
  /** 评分 0–5（示例） */
  rating: number
  /** 评分人数（示例） */
  ratingCount: number
  /** 榜单热度，仅用于示例排序 */
  popularity: number
  /** 未上架时的估算体量（MB，示例） */
  estimatedSizeMb: number
  screenshots: Screenshot[]
  reviews: Review[]
  changelog: ChangeEntry[]
}

/** 首页精选合集 */
export interface Collection {
  id: string
  title: string
  subtitle: string
  slugs: string[]
}

/** 榜单排序方式 */
export type ChartSort = 'popularity' | 'chapters' | 'size'


/** 首页「编辑精选」小卡 */
export interface FeaturedCard {
  id: string
  /** 指向的作品 slug */
  slug: string
  /** 角标，如「编辑精选」 */
  heading: string
  /** 压缩成一行的小卡短评 */
  blurb: string
  /** 作品名 */
  name: string
  /** 卷号与话数范围 */
  subtitle: string
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
