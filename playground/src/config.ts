interface NavItem {
  name: string
  url: string
  mode?: 'dev' | 'prod'
}

interface SidebarItem {
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
        },
        {
          name: 'Components',
          url: '/procomponent/components',
          children: [
            {
              name: 'ProForm',
              url: '/procomponent/pro-form',
            },
            {
              name: 'ProTable',
              url: '/procomponent/pro-table',
            },
            {
              name: 'ProTree',
              url: '/procomponent/pro-tree',
            },
            {
              name: 'ProText',
              url: '/procomponent/pro-text',
            },
            {
              name: 'Watermark',
              url: '/procomponent/watermark',
            },
            {
              name: 'ProDescriptions',
              url: '/procomponent/pro-descriptions',
            },
          ]
        },
      ]
    },
    {
      name: 'Data V',
      items: [
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
  ]
}

export default config