<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import Brand from './brand.vue'

</script>

<template>
    <ProLayout
        mode="vertical"
        :brand="Brand"
    >
        <template #header>
            Vertical Layout
        </template>
        <div class="flex justify-center items-center min-h-300px bg-neutral-300">
            haha haha
        </div>
        <template #footer>
            <div class="flex justify-center items-center h-32px text-gray py-4">
                软件版权所有 © 2023-present banmao
            </div>
        </template>
    </ProLayout>

</template>
