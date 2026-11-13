<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { sidebar, type SidebarItem } from '@/config'

defineProps<{ open?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const keyword = ref('')

const prefixPath = computed(() => `/${route.path.split('/')[1]}/`)

const items = computed<SidebarItem[]>(() => sidebar[prefixPath.value] ?? [])

function normalize(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

function isActive(url?: string) {
  if (!url) return false
  return normalize(route.path) === normalize(url)
}

function match(name: string) {
  return name.toLowerCase().includes(keyword.value.trim().toLowerCase())
}

const filtered = computed<SidebarItem[]>(() => {
  if (!keyword.value.trim()) return items.value
  const result: SidebarItem[] = []
  for (const item of items.value) {
    if (item.children) {
      if (match(item.name)) {
        result.push(item)
        continue
      }
      const children = item.children.filter(child => match(child.name))
      if (children.length) result.push({ ...item, children })
    } else if (match(item.name)) {
      result.push(item)
    }
  }
  return result
})
</script>

<template>
  <aside class="bm-sidebar" :class="{ 'is-open': open }">
    <div class="bm-sidebar-head">
      <p class="bm-mono-label">导航 / MENU</p>
      <button type="button" class="bm-sidebar-close" aria-label="关闭导航" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <label class="bm-sidebar-filter">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-3.8-3.8" />
      </svg>
      <input v-model="keyword" type="text" placeholder="筛选条目…" />
    </label>

    <nav class="bm-sidebar-groups">
      <template v-for="(item, index) in filtered" :key="index">
        <section v-if="item.children" class="bm-sidebar-group">
          <p class="bm-sidebar-group-name bm-mono-label">{{ item.name }}</p>
          <template v-for="child in item.children" :key="child.name">
            <span v-if="child.planned" class="bm-sidebar-link is-planned">
              <span class="bm-sidebar-name">{{ child.name }}</span>
              <em>规划中</em>
            </span>
            <RouterLink
              v-else
              :to="child.url!"
              class="bm-sidebar-link"
              :class="{ 'is-active': isActive(child.url) }"
            >
              <span class="bm-sidebar-name">{{ child.name }}</span>
            </RouterLink>
          </template>
        </section>

        <template v-else>
          <span v-if="item.planned" class="bm-sidebar-link is-planned">
            <span class="bm-sidebar-name">{{ item.name }}</span>
            <em>规划中</em>
          </span>
          <RouterLink
            v-else
            :to="item.url!"
            class="bm-sidebar-link bm-sidebar-top"
            :class="{ 'is-active': isActive(item.url) }"
          >
            <span class="bm-sidebar-name">{{ item.name }}</span>
          </RouterLink>
        </template>
      </template>

      <p v-if="!filtered.length" class="bm-sidebar-empty">
        没有匹配「{{ keyword }}」的条目
      </p>
    </nav>
  </aside>
</template>

<style scoped>
.bm-sidebar {
  position: sticky;
  top: calc(var(--layout-header-height) + 36px);
  max-height: calc(100svh - var(--layout-header-height) - 72px);
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.bm-sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.bm-sidebar-close {
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-divider);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-foreground-secondary);
  cursor: pointer;
}
.bm-sidebar-close svg {
  width: 15px;
  height: 15px;
}

.bm-sidebar-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 18px;
  border: 1px solid var(--color-divider);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-foreground-tertiary);
  transition: border-color 0.2s ease;
}
.bm-sidebar-filter:focus-within {
  border-color: var(--color-primary);
}
.bm-sidebar-filter svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.bm-sidebar-filter input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--color-foreground);
}
.bm-sidebar-filter input::placeholder {
  color: var(--color-foreground-tertiary);
}

.bm-sidebar-group {
  margin-bottom: 22px;
}

.bm-sidebar-group-name {
  margin: 0 0 8px;
  padding-left: 12px;
  color: var(--color-foreground-tertiary);
}

.bm-sidebar-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 12px;
  margin: 2px 0;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-foreground-secondary);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.bm-sidebar-link:hover {
  background: var(--color-hover);
  color: var(--color-foreground);
}
.bm-sidebar-link.is-active {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  font-weight: 600;
}
.bm-sidebar-link.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 22%;
  height: 56%;
  width: 2.5px;
  border-radius: 2px;
  background: var(--color-primary);
}
.bm-sidebar-top {
  font-weight: 500;
}

.bm-sidebar-link.is-planned {
  cursor: default;
  opacity: 0.62;
}
.bm-sidebar-link.is-planned:hover {
  background: transparent;
  color: var(--color-foreground-secondary);
}
.bm-sidebar-link.is-planned em {
  flex-shrink: 0;
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 1px 6px;
  border: 1px dashed var(--color-divider);
  border-radius: 999px;
  color: var(--color-foreground-tertiary);
}

.bm-sidebar-empty {
  padding: 12px;
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}

@media (max-width: 1023px) {
  .bm-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    width: 300px;
    max-height: none;
    padding: 20px 18px 32px;
    background: var(--color-surface);
    border-right: 1px solid var(--color-divider);
    transform: translateX(-105%);
    transition: transform 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
  .bm-sidebar.is-open {
    transform: translateX(0);
    box-shadow: 24px 0 64px var(--color-shadow);
  }
  .bm-sidebar-close {
    display: inline-flex;
  }
}
</style>
