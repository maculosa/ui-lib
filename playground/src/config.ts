export interface NavItem {
  name: string
  url: string
  mode?: 'dev' | 'prod'
}

export interface SidebarItem {
  name: string
  url: string
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

function getDocsSidebar() {
  return []
}

function getComponentSidebar() {
  return [
        {
          name: 'Overview',
          url: '/procomponent/overview'
        },
        {
          name: 'Components',
          url: '/procomponent/components',
          children: [
            {
              name: 'ProForm',
              url: '/procomponent/ProForm',
            },
            {
              name: 'ProTable',
              url: '/procomponent/ProTable',
            },
            {
              name: 'ProTree',
              url: '/procomponent/ProTree',
            },
            {
              name: 'ProText',
              url: '/procomponent/ProText',
            },
            {
              name: 'Watermark',
              url: '/procomponent/watermark',
            },
            {
              name: 'ProDescriptions',
              url: '/procomponent/ProDescriptions',
            },
          ]
        },
      ]
}

function getDataVSidebar() {
  return [
        {
          name: 'Overview',
          url: '/datav/overview'
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
            }
          ]
        }
      ]
}

function getBlocksSidebar() {
  return [
        {
          name: 'Overview',
          url: '/blocks/overview'
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
            }
          ]
        }
      ]
}


export const config: Config = {
  navItems: [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'Docs',
      url: '/docs/zh'
    },
    {
      name: 'Component',
      url: '/procomponent',
      mode: 'dev'
    },
    {
      name: 'Blocks',
      url: '/blocks',
    },
    {
      name: 'Data V',
      url: '/datav'
    }
  ],
  sidebars: [
    {
      name: 'Docs',
      items: getDocsSidebar()
    },
    {
      name: 'ProComponent',
      items: getComponentSidebar()
    },
    {
      name: 'Data V',
      items: getDataVSidebar()
    },
    {
      name: 'Blocks',
      items: getBlocksSidebar()
    }
  ]
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