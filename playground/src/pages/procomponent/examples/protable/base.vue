<template>
    <ProTable
        title="Base Table"
        :columns
        :data="dataSource"
    />
</template>

<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import { NButton } from 'naive-ui';
import { ref } from 'vue';

interface RowType {
    name: string;
    age: number;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    city: string;
    country: string;
    company: string;
}

const columns = ref([
    { type: 'index' },
    {
        title: '姓名',
        key: 'name',
        valueType: 'text',
        width: 100
    },
    {
        title: '年龄',
        key: 'age',
        hideInSearch: true,
        width: 80
    },
    {
        title: '性别',
        key: 'gender',
        hideInSearch: true,
        width: 80
    },
    {
        title: '邮箱',
        key: 'email',
        hideInSearch: true,
        width: 150
    },
    {
        title: '电话',
        key: 'phone',
        hideInSearch: true,
        width: 110
    },
    {
        title: '城市',
        key: 'city',
        hideInSearch: true,
        width: 100
    },
    {
        title: '国家',
        key: 'country',
        hideInSearch: true,
        width: 64
    },
    {
        title: '公司',
        key: 'company',
        hideInSearch: true,
        copyable: {
            ellipsis: false, 
            lineClamp: 2, // 最多显示两行，超出显示省略号， 仅在 ellipsis 为 true 时生效
        },
        width: 200
    },
    {
        title: '操作',
        key: 'actions',
        fixed: 'right',
        render(row: RowType) {
            return <NButton type="success" ghost size='small'
                onClick={() => {
                    console.log('edit', row)
                }}
            >
                编辑
            </NButton>
        }
    }
])

const dataSource = ref([
    {
        name: '张三',
        age: 18,
        gender: 'male',
        email: '123@qq.com',
        phone: '123456789',
        city: '北京',
        country: '中国',
        company: '公司'
    },
    {
        name: '王五',
        age: 20,
        gender: 'female',
        email: '123@qq.com',
        phone: '123456789',
        city: '上海',
        country: '中国',
        company: 'Google Corp. LTC Company. Distributed by Apple Inc.'
    },
])
</script>

