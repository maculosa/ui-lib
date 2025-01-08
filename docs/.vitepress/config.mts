import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Banmao Vue Tools",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Banmao', link: '/' },
      { text: 'ProComponent', link: '/procomponent' },
      { text: 'DataV', link: '/data-v' },
      { text: 'Hooks', link: '/hooks/' }
    ],

    sidebar: {
      '/guide': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/procomponent': [
        {
          text: 'ProComponent',
          items: [
            { text: 'Introduction', link: '/procomponent/introduction' },
            { text: 'Getting Started', link: '/procomponent/getting-started' }
          ]
        },
        {
          text: 'ProTable',
          items: [
            { text: 'Overview', link: '/procomponent/pro-table' },
            { text: 'Getting Started', link: '/procomponent/pro-table' }
          ]
        }
      ],
      '/data-v': [
        {
          text: 'DataV',
          items: [
            { text: 'Introduction', link: '/data-v/introduction' },
            { text: 'Getting Started', link: '/data-v/getting-started' }
          ]
        }
      ],
      '/hooks': [
        {
          text: 'Hooks',
          items: [
            { text: 'Introduction', link: '/hooks/introduction' },
            { text: 'Getting Started', link: '/hooks/getting-started' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
