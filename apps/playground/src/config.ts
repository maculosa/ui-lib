import { computed } from 'vue'
import { locale, t, toLocalePath } from '@/locales'

export interface NavItem {
  name: string
  url: string
}

export interface SidebarItem {
  name: string
  url?: string
  planned?: boolean
  children?: SidebarItem[]
}

interface Sidebar {
  name: string
  items: SidebarItem[]
}

interface RawItem {
  key: string
  url?: string
  planned?: boolean
  /** 由 markdown 承载、存在 /en 镜像译文的页面；Vue 页面同址双语，不镜像。 */
  mirrored?: boolean
  children?: RawItem[]
}

const navRaw: RawItem[] = [
  { key: 'nav.home', url: '/' },
  { key: 'nav.docs', url: '/docs/zh', mirrored: true },
  { key: 'nav.components', url: '/procomponent' },
  { key: 'nav.charts', url: '/datav' },
  { key: 'nav.blocks', url: '/blocks' },
  { key: 'nav.ui', url: '/ui', mirrored: true },
  { key: 'nav.examples', url: '/examples' },
]

const docsRaw: RawItem[] = [
  { key: 'sidebar.docsOverview', url: '/docs/overview', mirrored: true },
  { key: 'sidebar.docsZh', url: '/docs/zh' },
  { key: 'sidebar.docsEn', url: '/docs/en' },
]

const proRaw: RawItem[] = [
  { key: 'sidebar.proOverview', url: '/procomponent/overview', mirrored: true },
  { key: 'sidebar.proCatalog', url: '/procomponent' },
  {
    key: 'sidebar.groupLayout',
    children: [
      { key: 'sidebar.proLayout', url: '/procomponent/ProLayout', mirrored: true },
      { key: 'sidebar.proTabs', planned: true },
      { key: 'sidebar.actions', planned: true },
    ],
  },
  {
    key: 'sidebar.groupEntry',
    children: [
      { key: 'sidebar.proForm', url: '/procomponent/ProForm', mirrored: true },
      { key: 'sidebar.modalForm', planned: true },
      { key: 'sidebar.drawerForm', planned: true },
      { key: 'sidebar.stepsForm', planned: true },
      { key: 'sidebar.queryFilter', planned: true },
      { key: 'sidebar.liteFilter', planned: true },
    ],
  },
  {
    key: 'sidebar.groupDisplay',
    children: [
      { key: 'sidebar.proTable', url: '/procomponent/ProTable', mirrored: true },
      { key: 'sidebar.proDescriptions', url: '/procomponent/ProDescriptions', mirrored: true },
      { key: 'sidebar.proTree', url: '/procomponent/ProTree', mirrored: true },
      { key: 'sidebar.proText', url: '/procomponent/ProText', mirrored: true },
      { key: 'sidebar.proList', planned: true },
      { key: 'sidebar.textClamp', planned: true },
    ],
  },
  {
    key: 'sidebar.groupGeneral',
    children: [
      { key: 'sidebar.watermark', url: '/procomponent/watermark', mirrored: true },
      { key: 'sidebar.naiveProvider', url: '/procomponent/naive-provider', mirrored: true },
      { key: 'sidebar.tour', planned: true },
    ],
  },
]

const datavRaw: RawItem[] = [
  { key: 'sidebar.datavWorkshop', url: '/datav' },
  {
    key: 'sidebar.datavGroup',
    children: [
      { key: 'sidebar.datavChart', url: '/datav/bar_line' },
      { key: 'sidebar.datavPie', url: '/datav/pie' },
      { key: 'sidebar.datavCircleBar', url: '/datav/circle_bar' },
      { key: 'sidebar.datavCubeBar', url: '/datav/cube_bar' },
    ],
  },
]

const blocksRaw: RawItem[] = [
  { key: 'sidebar.blocksOverview', url: '/blocks/overview', mirrored: true },
  { key: 'sidebar.blocksGallery', url: '/blocks' },
  { key: 'sidebar.blocksLogin', url: '/blocks/login', mirrored: true },
  { key: 'sidebar.blocksRegister', planned: true },
  { key: 'sidebar.blocksDashboard', planned: true },
]

const uiRaw: RawItem[] = [{ key: 'sidebar.uiOverview', url: '/ui', mirrored: true }]

function resolveItem(item: RawItem): SidebarItem {
  const url = item.url
    ? item.mirrored
      ? toLocalePath(item.url, locale.value)
      : item.url
    : undefined
  return {
    name: t(item.key),
    url,
    planned: item.planned,
    children: item.children?.map(resolveItem),
  }
}

function resolve(items: RawItem[]): SidebarItem[] {
  return items.map(resolveItem)
}

function collectMirrored(items: RawItem[], into: Set<string>) {
  for (const item of items) {
    if (item.mirrored && item.url) into.add(item.url)
    if (item.children) collectMirrored(item.children, into)
  }
}

/** 存在英文镜像的中文规范路径，供语言切换判断是否需要跳转。 */
export const mirroredPaths = (() => {
  const set = new Set<string>()
  for (const items of [navRaw, docsRaw, proRaw, datavRaw, blocksRaw, uiRaw]) {
    collectMirrored(items, set)
  }
  return set
})()

export const navItems = computed<NavItem[]>(() =>
  navRaw.map(item => ({
    name: t(item.key),
    url: item.mirrored ? toLocalePath(item.url!, locale.value) : item.url!,
  })),
)

export const sidebar = computed<Record<string, SidebarItem[]>>(() => ({
  '/docs/': resolve(docsRaw),
  '/procomponent/': resolve(proRaw),
  '/ui/': resolve(uiRaw),
  '/datav/': resolve(datavRaw),
  '/blocks/': resolve(blocksRaw),
}))

export const sidebars = computed<Sidebar[]>(() => [
  { name: t('nav.docs'), items: resolve(docsRaw) },
  { name: 'ProComponent', items: resolve(proRaw) },
  { name: 'UI', items: resolve(uiRaw) },
  { name: 'Data V', items: resolve(datavRaw) },
  { name: 'Blocks', items: resolve(blocksRaw) },
])

export default { navItems, sidebars, sidebar }