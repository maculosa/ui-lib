<script setup lang="ts">
    import { ProLayout } from '@banmao/procomponent'
    import { ref } from 'vue';

    const menus = ref([
        {
            label: '首页',
            path: '/',
        },
        {
            label: '列表',
            path: '/list',
        },
        {
            label: '系统管理',
            children: [
                {
                    label: '用户管理',
                    path: '/user',
                },
                {
                    label: '角色管理',
                    path: '/role',
                },
                {
                    label: '菜单管理',
                    path: '/menu',
                },
                {
                    label: '日志管理',
                    path: '/log',
                },
            ]
        },

    ])
</script>

<template>
    <ProLayout title="Base Layout" class="h-[400px]"
        :menus="menus"
        :style="{
            height: '400px',
        }"
        collapsed
    >
        <p>
            这是内容区域
        </p>
    </ProLayout>
</template>
