export interface NavItem {
  name: string
  url: string
  mode?: 'dev' | 'prod'
}

interface SidebarSubItem {
  name: string
  url: string
}

export interface SidebarItem {
  name: string
  url?: string
  children?: SidebarSubItem[]
}

interface Sidebar {
  name: string
  items: SidebarItem[]
}

interface Config {
  navItems: NavItem[]
  sidebars: Sidebar[]
}

function getDocsSidebar() {
  return []
}

function getComponentSidebar(): SidebarItem[] {
  return [
    {
      name: 'Overview',
      url: '/procomponent/overview',
    },
    {
      name: 'LAYOUT',
      url: '/procomponent/Layout',
      children: [
        {
          name: 'ProLayout',
          url: '/procomponent/ProLayout',
        },
        {
          name: 'PageContainer',
          url: '/procomponent/PageContainer',
        },
        {
          name: 'ProCard',
          url: '/procomponent/ProCard',
        },
        {
          name: 'StatisticCard',
          url: '/procomponent/StatisticCard',
        },
        {
          name: 'CheckCard',
          url: '/procomponent/CheckCard',
        },
      ],
    },
    {
      name: 'DATA ENTRY',
      url: '/procomponent/DataEntry',
      children: [
        {
          name: 'ProForm',
          url: '/procomponent/ProForm',
        },
        {
          name: 'StepsForm',
          url: '/procomponent/StepForm',
        },
        {
          name: 'ModalForm',
          url: '/procomponent/ModalForm',
        },
        {
          name: 'LightFilter',
          url: '/procomponent/LightFilter',
        },
        {
          name: 'LoginFormPage',
          url: '/procomponent/LoginFormPage',
        },
      ],
    },
    {
      name: 'DATA DISPLAY',
      url: '/procomponent/DataDisplay',
      children: [
        {
          name: 'ProTable',
          url: '/procomponent/ProTable',
        },
        {
          name: 'ProDescriptions',
          url: '/procomponent/ProDescriptions',
        },
        {
          name: 'ProList',
          url: '/procomponent/ProList',
        },
        {
          name: 'ProTree',
          url: '/procomponent/ProTree',
        },
        {
          name: 'ProText',
          url: '/procomponent/ProText',
        },
      ],
    },
    {
      name: 'UNIVERSAL',
      url: '/procomponent/Universal',
      children: [
        {
          name: 'ProSkeleton',
          url: '/procomponent/ProSkeleton',
        },
        {
          name: 'Watermark',
          url: '/procomponent/watermark',
        },
        {
          name: 'Tour',
          url: '/procomponent/Tour',
        },
        {
          name: 'ProTime',
          url: '/procomponent/ProTime',
        },
        {
          name: 'NaiveProvider',
          url: '/procomponent/NaiveProvider',
        },
        {
          name: 'Actions',
          url: '/procomponent/Actions',
        },
        {
          name: 'AnimateTabs',
          url: '/procomponent/AnimateTabs',
        },
      ],
    },
  ]
}

function getDataVSidebar() {
  return [
    {
      name: 'Overview',
      url: '/datav/overview',
    },
    {
      name: 'Components',
      url: '/datav/components',
      children: [
        {
          name: 'Bar',
          url: '/datav/bar',
        },
        {
          name: 'Line',
          url: '/datav/line',
        },
      ],
    },
  ]
}

function getBlocksSidebar() {
  return [
    {
      name: 'Overview',
      url: '/blocks/overview',
    },
    {
      name: 'Components',
      url: '/blocks/components',
      children: [
        {
          name: 'Login',
          url: '/blocks/login',
        },
        {
          name: 'Register',
          url: '/blocks/register',
        },
        {
          name: 'Dashboard',
          url: '/blocks/dashboard',
        },
      ],
    },
  ]
}

export const config: Config = {
  navItems: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Docs',
      url: '/docs/zh',
    },
    {
      name: 'Component',
      url: '/procomponent',
      mode: 'dev',
    },
    {
      name: 'Blocks',
      url: '/blocks',
    },
    {
      name: 'Data V',
      url: '/datav',
    },
  ],
  sidebars: [
    {
      name: 'Docs',
      items: getDocsSidebar(),
    },
    {
      name: 'ProComponent',
      items: getComponentSidebar(),
    },
    {
      name: 'Data V',
      items: getDataVSidebar(),
    },
    {
      name: 'Blocks',
      items: getBlocksSidebar(),
    },
  ],
}

function getSidebars(): Record<string, SidebarItem[]> {
  return {
    '/docs/': getDocsSidebar(),
    '/procomponent/': getComponentSidebar(),
    '/datav/': getDataVSidebar(),
    '/blocks/': getBlocksSidebar(),
  }
}

export const sidebar = getSidebars()

export default config
