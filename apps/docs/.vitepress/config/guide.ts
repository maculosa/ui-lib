export interface GuideConfig {
    name: string
    i18n: string
}

export interface GuideGroup {
    name: string
    guides: GuideConfig[]
}

export function getGuideConfig(): GuideGroup[] {
    return [
        {
            name: 'introduction',
            guides: [
                { name: 'banmao-components', i18n: 'banmaocomps' },
                { name: 'getting-started', i18n: 'gettingstarted' },
                { name: 'installation', i18n: 'installation' },
                { name: 'usage', i18n: 'usage' },
                { name: 'theme', i18n: 'theme' },
                { name: 'i18n', i18n: 'i18n' }
            ]
        },
        {
            name: 'further',
            guides: [
                { name: 'global-config', i18n: 'globalconfig' },
                { name: 'theme-config', i18n: 'themeconfig' },
                { name: 'i18n', i18n: 'i18n' },
                { name: 'faq', i18n: 'faq' },
                { name: 'changelog', i18n: 'changelog' },
                { name: 'sponsor', i18n: 'sponsor' },
                { name: 'donate', i18n: 'donate' },
            ]
        }
    ]
}