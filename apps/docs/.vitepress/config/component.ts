export interface ComponentConfig {
    name: string
    since?: string
}

export interface ComponentGroup {
    name: string
    components: ComponentConfig[]
}

export function getComponentConfig(): ComponentGroup[] {
    return [
        {
            name: 'basic',
            components: [
                { name: 'Button' },
                { name: 'Icon' },
                { name: 'Link' },
                { name: 'Typography', since: '1.0.0' }
            ]
        }
    ]
}