<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton } from '@banmao/procomponent'
import { NButton } from 'naive-ui'

const lastAction = ref('尚未操作')

const items: ActionButton[] = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary',
    onClick: item => (lastAction.value = item.label),
  },
  {
    label: '复制',
    key: 'copy',
    variant: 'success',
    onClick: item => (lastAction.value = item.label),
  },
  {
    label: '删除',
    key: 'delete',
    variant: 'error',
    onClick: item => (lastAction.value = item.label),
  },
]

function run(item: ActionButton, close: () => void) {
  item.onClick?.(item)
  close()
}
</script>

<template>
  <Actions :items="items" :show-num="1">
    <template #overflow="{ items: overflowItems, close }: { items: ActionButton[]; close: () => void }">
      <div class="w-[180px]">
        <div class="px-2 py-1 text-xs opacity-60">常用操作</div>
        <NButton
          v-for="item in overflowItems.filter(entry => entry.variant !== 'error')"
          :key="item.key"
          quaternary
          block
          @click="run(item, close)"
        >
          {{ item.label }}
        </NButton>

        <template v-if="overflowItems.some(entry => entry.variant === 'error')">
          <div class="my-1 h-px bg-current/10" />
          <div class="px-2 py-1 text-xs opacity-60">危险操作</div>
          <NButton
            v-for="item in overflowItems.filter(entry => entry.variant === 'error')"
            :key="item.key"
            quaternary
            block
            type="error"
            @click="run(item, close)"
          >
            {{ item.label }}
          </NButton>
        </template>
      </div>
    </template>
  </Actions>

  <div class="mt-3 space-y-1 font-mono text-xs opacity-70">
    <div>lastAction = {{ lastAction }}</div>
    <div>自定义面板内需要自行调用 item.onClick 并决定何时 close()</div>
  </div>
</template>
