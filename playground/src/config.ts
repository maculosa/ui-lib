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
    },
    {
      name: 'Blocks',
      items: [
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
  ]
}

export default config