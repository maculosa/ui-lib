<script setup lang="ts">
import { ProLayout } from '@banmao/procomponent'
import Brand from './brand.vue'
import { NRadioGroup } from 'naive-ui';
import { ref } from 'vue';

const theme = ref('arc')

</script>

<template>
    <NRadioGroup v-model:value="theme">
        <NRadio value="arc">Arc 风格</NRadio>
        <NRadio value="normal">Normal 风格</NRadio>
    </NRadioGroup>
    <ProLayout mode="horizontal"
        :brand="Brand"
        theme="arc"
    >
        <template #sider>
            <div>
                sider
            </div>
        </template>
        <div class="flex justify-center items-center min-h-300px">
            haha haha
        </div>
    </ProLayout>

</template>
