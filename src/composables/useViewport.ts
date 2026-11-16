/**
 * 视口断点 composable —— 移植自泄露源码
 * shared/components/src/utils/getMediaConditions.ts + stores/sidebar-hidden.ts
 *
 * 苹果原始断点（含 260px 侧边栏偏移前的有效值，实测自编译 CSS）：
 *   xsmall ≤414 | small 415–483 | medium 484–999 | large 1000–1259 | xlarge ≥1260
 * 侧边栏：≥484px 常驻（iPad 竖屏也显示），<484px 收起为汉堡菜单
 */
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type ViewportSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

const SIZE_QUERIES: Array<[ViewportSize, string]> = [
  ['xsmall', '(max-width: 414px)'],
  ['small', '(min-width: 415px) and (max-width: 483px)'],
  ['medium', '(min-width: 484px) and (max-width: 999px)'],
  ['large', '(min-width: 1000px) and (max-width: 1259px)'],
  ['xlarge', '(min-width: 1260px)'],
]

export function useViewport(): { size: Ref<ViewportSize>; sidebarHidden: Ref<boolean> } {
  const size = ref<ViewportSize>('medium')
  const sidebarHidden = ref(false)

  const lists: MediaQueryList[] = []
  const update = () => {
    for (const [name, list] of SIZE_QUERIES.map(([n], i) => [n, lists[i]] as const)) {
      if (list.matches) size.value = name
    }
    sidebarHidden.value = size.value === 'xsmall' || size.value === 'small'
  }

  onMounted(() => {
    for (const [, query] of SIZE_QUERIES) {
      const list = window.matchMedia(query)
      list.addEventListener('change', update)
      lists.push(list)
    }
    update()
  })

  onBeforeUnmount(() => {
    for (const list of lists) list.removeEventListener('change', update)
  })

  return { size, sidebarHidden }
}
