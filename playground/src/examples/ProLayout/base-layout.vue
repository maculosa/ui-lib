<script setup lang="tsx">
    import { ProLayout } from '@banmao/procomponent'
    import { ref } from 'vue';
    import { Icon } from '@iconify/vue'

    const renderIcon = (icon: string) => {
        return () => <Icon icon={icon} class="text-white cursor-pointer" />
    }
    const menus = ref([
        {
            label: '首页',
            key: '/',
            icon: renderIcon('hugeicons:home-01'),
        },
        {
            label: '列表',
            key: '/list',
            icon: renderIcon('hugeicons:left-to-right-list-dash'),
        },
        {
            label: '表格',
            key: '/table',
            icon: renderIcon('hugeicons:table-01'),
        },
        {
            label: '图表',
            key: '/chart',
            icon: renderIcon('hugeicons:chart-01'),
        },
        {
            label: '文件管理',
            key: '/file',
            icon: renderIcon('hugeicons:file-01'),
        },
        {
            label: '参数管理',
            key: '/param',
            icon: renderIcon('hugeicons:settings-02'),
        },
        {
            label: '服务器管理',
            key: '/server',
            icon: renderIcon('hugeicons:server-stack-01'),
        },
        {
            label: '仓库管理',
            key: '/repo',
            icon: renderIcon('hugeicons:repository'),
        },
        {
            label: '系统管理',
            key: '/system',
            icon: renderIcon('hugeicons:settings-02'),
            children: [
                {
                    label: '用户管理',
                    key: '/user',
                },
                {
                    label: '角色管理',
                    key: '/role',
                },
                {
                    label: '菜单管理',
                    key: '/menu',
                },
                {
                    label: '日志管理',
                    key: '/log',
                },
            ]
        },

    ])
</script>

<template>
    <ProLayout title="Base Layout"
        :menus="menus"

        collapsedTriggerPosition="top"
        :render-icon="renderIcon"
        :style="{
            height: '460px',
        }"
        :collapsed="false"
    >
        <p>
            这是内容区域
        </p>
    </ProLayout>
</template>
