<script setup lang="ts">
import { Pie } from 'datav'
import { ref } from 'vue';

const data = ref([
    {
        name: '小米',
        value: 100,
    },
    {
        name: '华为',
        value: 200,
    },
    {
        name: '苹果',
        value: 300,
    },
    {
        name: 'OPPO',
        value: 400,
    },
    {
        name: 'vivo',
        value: 500,
    },

])
</script>

<template>
    <div style="width: 100%; height: 600px;">
        <Pie :title="{
            text: 'Pie'
        }" :data="data" :legend="{
            show: false
        }" />
    </div>

    <div style="width: 100%; height: 600px;">
        <Pie :title="{ text: 'Doughnut Pie' }" :data="data" :legend="{
            show: false
        }" type="doughnut" />
    </div>
</template>