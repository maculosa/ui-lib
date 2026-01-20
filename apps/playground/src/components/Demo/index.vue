<template>
  <div
    class="my-10 rounded-lg overflow-hidden bg-transparent backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-zinc-300/40 dark:border-gray/40 border-solid"
  >
    <div class="flex justify-between items-center p-3 box-border dark:border-b-primary/20 bg-white/60 dark:bg-zinc-900/40">
      <div class="flex flex-col gap-1">
        <h4 class="my-0!" :id="title">{{ title }}</h4>
        <span v-if="desc" class="text-base text-secondary/20">{{ desc }}</span>
      </div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon
              icon="carbon:code"
              width="28"
              height="28"
              class="outline-0 p-1 rounded-1 dark:text-zinc-300 hover:text-primary hover:bg-primary/10 active:text-primary cursor-pointer transition-all transition-delay-200 ease"
              :class="{ active: visible }"
              @click="toggle()"
            />
          </template>
          查看代码
        </n-tooltip>
    </div>

    <div v-if="!url" class="p-2 bg-background">
      <slot />
    </div>

    <iframe v-if="url" class="mx-auto w-960px h-600px" :src="url"></iframe>

    <n-collapse-transition :show="visible">
      <CodePreview :code="raw" />
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useToggle } from '@vueuse/core'
import { NTooltip, NCollapseTransition } from 'naive-ui'
import { Icon } from '@iconify/vue'

export interface DemoProps {
  title?: string
  desc?: string
  url?: string
  raw?: string
}

const props = defineProps<DemoProps>()
const { title, desc, raw, url } = toRefs(props)
const [visible, toggle] = useToggle(false)
</script>
