interface NavItem {
  name: string
  url: string
  mode?: 'dev' | 'prod'
}

interface SidebarItem {
  name: string
  url: string
}

interface Sidebar {
  name: string
  items: SidebarItem[]
}

interface Config {
  navItems: NavItem[]
  sidebars: Sidebar[]
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
      name: 'ProComponent',
      url: '/procomponent',
      mode: 'dev'
    },
    {
      name: 'Data V',
      url: '/datav'
    }
  ],
  sidebars: [
    {
      name: 'Docs',
      items: []
    },
    {
      name: 'ProComponent',
      items: [
        {
          name: 'Overview',
          url: '/procomponent/overview'
        }
      ]
    }
  ]
}

export default config