function getDataVSideBar() {

    return [
        { text: '介绍', link: 'introduce/' },
        { text: '快速上手', link: 'getting-started/' },
        {
            text: '组件',
            link: 'components/',
            collapsed: false,
            items: [
                { text: 'Charts', link: 'components/base-chart/' },
            ],
        },
        {
            text: '其他',
            collapsed: false,
            items: [
                { text: '更新日志', link: 'https://github.com/banmaoStudio/procomponent/blob/main/packages/procomponent/CHANGELOG.md', target: '_blank' },
                { text: 'FAQ', link: 'faq/' },
                { text: 'Contributing', link: 'contributing/' },
            ],
        },
    ]
}

function getGuideSideBar() {
    return [
        {
            text: 'Overview',
            link: '/docs/guide/overview'
        }
    ]
}

function getProComponentSideBar() {
    return [
        { text: '介绍', link: '' },
        { text: '快速上手', link: 'getting-started/' },
        {
            text: '组件',
            collapsed: false,
            items: [
                {
                    text: '表单',
                    collapsed: true,
                    items: [
                        { text: 'DrawerForm', link: 'drawer-form/' },
                        { text: 'ModalForm', link: 'modal-form/' },
                        { text: 'ProForm', link: 'pro-form/' },
                        { text: 'QueryFilter', link: 'query-filter/' },
                    ],
                },
                {
                    text: '数据',
                    collapsed: true,
                    items: [
                        { text: 'ProTable', link: 'pro-table/' },
                        { text: 'ProList', link: 'pro-list/' },
                        { text: 'ProDescriptions', link: 'pro-descriptions/' },

                    ],
                },
                {
                    text: '布局',
                    collapsed: true,
                    items: [
                        { text: 'ProLayout', link: 'pro-layout/' },
                    ],
                },
                {
                    text: '通用',
                    collapsed: true,
                    items: [
                        { text: 'ProText', link: 'pro-text/' },
                        { text: 'Watermark', link: 'watermark/' },
                    ],
                },
            ],
        },
        {
            text: 'Others',
            collapsed: true,
            items: [
                { text: '更新日志', link: 'https://github.com/banmaoStudio/procomponent/blob/main/packages/procomponent/CHANGELOG.md', target: '_blank' },
                { text: 'FAQ', link: 'faq/' },
                { text: 'Contributing', link: 'contributing/' },
            ],
        },
    ]
}

function getHooksSideBar() {
    return [
        {
            text: 'Overview',
            link: '/docs/hooks/overview'
        }
    ]
}

function getSidebars() {
    return {
        '/guide/': getGuideSideBar(),
        '/data-v/': getDataVSideBar(),
        '/procomponent/': getProComponentSideBar(),
        '/hooks/': getHooksSideBar()
    }
}

export const sidebar = getSidebars()
