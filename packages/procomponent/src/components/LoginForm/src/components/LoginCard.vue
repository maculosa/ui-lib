<script setup lang="ts">
import { cn } from '@/utils';
import type { LoginCardProps } from '../types';

const { title, description, shadow, rounded, border, class: className } = defineProps<LoginCardProps>()

const baseStyles = [
    'backdrop-blur-4',
    'text-card-foreground',
    'mx-auto',
    'max-w-sm',
    'bg-zinc-50/60',
    'dark:bg-zinc-800/60',
    'backdrop-blur-[2px]'
]
</script>

<template>
    <div :class="cn(
        baseStyles,
        {
            'shadow-xl': shadow ?? false,
            'rounded-xl': rounded ?? false,
            'border': border ?? false
        },
        className
    )">
        <div :class="cn('flex flex-col gap-y-1.5 p-6')">
            <h3 class="font-semibold tracking-tight text-2xl dark:text-gray-100">
                {{ title }}
            </h3>
            <p v-if="description" class="text-sm dark:text-gray-300">
                {{ description }}
            </p>
        </div>
        <div class="p-6 pt-0" aria-live="polite">
            <slot />
        </div>
    </div>
</template>