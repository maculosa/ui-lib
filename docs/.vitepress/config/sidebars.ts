function getDataVSideBar() {

    return [
        { text: '介绍', link: 'introduce/' },
        { text: '快速上手', link: 'getting-started/' },
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
                    collapsed: false,
                    items: [
                        { text: 'DrawerForm', link: 'drawer-form/' },
                        { text: 'ModalForm', link: 'modal-form/' },
                        { text: 'ProForm', link: 'pro-form/' },
                    ],
                },
                {
                    text: '数据',
                    collapsed: false,
                    items: [
                        { text: 'ProTable', link: 'pro-table/' },
                        { text: 'ProList', link: 'pro-list/' },
                        { text: 'ProDescriptions', link: 'pro-descriptions/' },

                    ],
                },
                {
                    text: '布局',
                    collapsed: false,
                    items: [
                        { text: 'ProLayout', link: 'pro-layout/' },
                    ],
                },
                {
                    text: '通用',
                    collapsed: false,
                    items: [
                        { text: 'ProText', link: 'pro-text/' },
                        { text: 'Watermark', link: 'watermark/' },
                        { text: 'Tour', link: 'tour/' },
                    ],
                },
            ],
        },
        {
            text: 'Others',
            collapsed: false,
            items: [
                { text: '更新日志', link: 'https://github.com/banmaoStudio/procomponent/blob/main/packages/procomponent/CHANGELOG.md', target: '_blank' },
                { text: 'FAQ', link: 'faq/' },
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
