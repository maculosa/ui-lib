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

interface Config {
  navItems: NavItem[]
  sidebars: Sidebar[]
}

function getDocsSidebar(): SidebarItem[] {
  return [
    { name: '概览', url: '/docs/overview' },
    { name: '中文指南', url: '/docs/zh' },
    { name: 'English Guide', url: '/docs/en' },
  ]
}

function getComponentSidebar(): SidebarItem[] {
  return [
    { name: '概览', url: '/procomponent/overview' },
    { name: '组件目录', url: '/procomponent' },
    {
      name: '布局',
      children: [
        { name: 'ProLayout 布局', url: '/procomponent/ProLayout' },
        { name: 'ProTabs 选项卡', planned: true },
        { name: 'Actions 操作组', planned: true },
      ],
    },
    {
      name: '数据录入',
      children: [
        { name: 'ProForm 表单', url: '/procomponent/ProForm' },
        { name: 'ModalForm 弹窗表单', planned: true },
        { name: 'DrawerForm 抽屉表单', planned: true },
        { name: 'StepsForm 分步表单', planned: true },
        { name: 'QueryFilter 查询过滤', planned: true },
        { name: 'LiteFilter 轻量筛选', planned: true },
      ],
    },
    {
      name: '数据展示',
      children: [
        { name: 'ProTable 表格', url: '/procomponent/ProTable' },
        { name: 'ProDescriptions 描述列表', url: '/procomponent/ProDescriptions' },
        { name: 'ProTree 树形控件', url: '/procomponent/ProTree' },
        { name: 'ProText 文本', url: '/procomponent/ProText' },
        { name: 'ProList 列表', planned: true },
        { name: 'TextClamp 文本截断', planned: true },
      ],
    },
    {
      name: '通用',
      children: [
        { name: 'Watermark 水印', url: '/procomponent/watermark' },
        { name: 'NaiveProvider 全局配置', url: '/procomponent/naive-provider' },
        { name: 'Tour 漫游引导', planned: true },
      ],
    },
  ]
}

function getDataVSidebar(): SidebarItem[] {
  return [
    { name: '图表工坊', url: '/datav' },
    {
      name: '图表组件',
      children: [
        { name: 'Chart 通用图表', url: '/datav/bar_line' },
        { name: 'Pie 饼图', url: '/datav/pie' },
        { name: 'CircleBar 圆形柱', url: '/datav/circle_bar' },
        { name: 'CubeBar 立方柱', url: '/datav/cube_bar' },
      ],
    },
  ]
}

function getBlocksSidebar(): SidebarItem[] {
  return [
    { name: '概览', url: '/blocks/overview' },
    { name: '区块画廊', url: '/blocks' },
    { name: 'Login 登录', url: '/blocks/login' },
    { name: 'Register 注册', planned: true },
    { name: 'Dashboard 仪表盘', planned: true },
  ]
}

function getUISidebar(): SidebarItem[] {
  return [
    { name: 'UI 总览', url: '/ui' },
  ]
}

export const config: Config = {
  navItems: [
    { name: '首页', url: '/' },
    { name: '文档', url: '/docs/zh' },
    { name: '组件', url: '/procomponent' },
    { name: '图表', url: '/datav' },
    { name: '区块', url: '/blocks' },
    { name: 'UI', url: '/ui' },
    { name: '示例', url: '/examples' },
  ],
  sidebars: [
    { name: '文档', items: getDocsSidebar() },
    { name: 'ProComponent', items: getComponentSidebar() },
    { name: 'UI', items: getUISidebar() },
    { name: 'Data V', items: getDataVSidebar() },
    { name: 'Blocks', items: getBlocksSidebar() },
  ],
}

function getSidebars(): Record<string, SidebarItem[]> {
  return {
    '/docs/': getDocsSidebar(),
    '/procomponent/': getComponentSidebar(),
    '/ui/': getUISidebar(),
    '/datav/': getDataVSidebar(),
    '/blocks/': getBlocksSidebar(),
  }
}

export const sidebar = getSidebars()

export default config
