<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MiniSearch from 'minisearch'
import records, { type SearchRecord } from 'virtual:search-index'
import { locale, t } from '@/locales'
import { closeSearch, searchOpen, toggleSearch } from '@/hooks/useSearch'

const router = useRouter()

/**
 * MiniSearch 默认分词器会把连续的中文视为单个 token，导致「表单」搜不到「ProForm 表单」的子串。
 * 这里对 CJK 追加单字与二元组，拉丁词保持整词，索引与查询共用同一分词器。
 */
function tokenize(text: string): string[] {
  const tokens: string[] = []
  const latin = text.toLowerCase().match(/[a-z0-9_]+/g)
  if (latin) tokens.push(...latin)
  const cjkRuns = text.match(/[\u4e00-\u9fff]+/g)
  if (cjkRuns) {
    for (const run of cjkRuns) {
      for (let i = 0; i < run.length; i += 1) {
        tokens.push(run[i])
        if (i + 1 < run.length) tokens.push(run.slice(i, i + 2))
      }
    }
  }
  return tokens
}

function resolve(record: SearchRecord): SearchRecord {
  return {
    ...record,
    title: record.titleKeys ? record.titleKeys.map(key => t(key)).join(' ') : record.title,
    description: record.descriptionKeys
      ? record.descriptionKeys.map(key => t(key)).join(' ')
      : record.description,
  }
}

// 词典 key 只有运行时才能解析，因此索引随语言重建
const engine = computed(() => {
  const instance = new MiniSearch<SearchRecord>({
    fields: ['title', 'heading', 'description'],
    storeFields: ['title', 'heading', 'description', 'path', 'hash', 'locale', 'group', 'titleKeys'],
    tokenize,
    searchOptions: {
      boost: { title: 3, heading: 2 },
      prefix: true,
      fuzzy: 0.2,
    },
  })
  instance.addAll(records.map(resolve))
  return instance
})

const keyword = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

const results = computed<SearchRecord[]>(() => {
  const query = keyword.value.trim()
  if (!query) return []
  return engine.value
    .search(query, { filter: result => result.locale === locale.value || !!result.titleKeys })
    .slice(0, 24) as unknown as SearchRecord[]
})

const groupLabels = computed<Record<string, string>>(() => ({
  docs: t('nav.docs'),
  procomponent: t('nav.components'),
  datav: t('nav.charts'),
  blocks: t('nav.blocks'),
  ui: t('nav.ui'),
  examples: t('nav.examples'),
  home: t('nav.home'),
}))

watch(results, () => {
  activeIndex.value = 0
})

watch(searchOpen, async opened => {
  if (opened) {
    lastFocused = document.activeElement as HTMLElement | null
    keyword.value = ''
    activeIndex.value = 0
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputEl.value?.focus()
  } else {
    document.body.style.overflow = ''
    lastFocused?.focus?.()
  }
})

function go(record: SearchRecord) {
  closeSearch()
  router.push({ path: record.path, hash: record.hash ? `#${record.hash}` : undefined })
}

function move(step: number) {
  const total = results.value.length
  if (!total) return
  activeIndex.value = (activeIndex.value + step + total) % total
  nextTick(() => {
    listEl.value?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggleSearch()
    return
  }
  if (!searchOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeSearch()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'Enter') {
    const record = results.value[activeIndex.value]
    if (record) {
      event.preventDefault()
      go(record)
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bm-search">
      <div v-if="searchOpen" class="bm-search-mask" @click.self="closeSearch">
        <div class="bm-search-panel" role="dialog" aria-modal="true" :aria-label="t('common.searchOpen')">
          <div class="bm-search-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M20 20l-3.8-3.8" />
            </svg>
            <input
              ref="inputEl"
              v-model="keyword"
              type="text"
              :placeholder="t('common.searchPlaceholder')"
              :aria-label="t('common.searchOpen')"
              autocomplete="off"
              spellcheck="false"
            />
            <kbd class="bm-search-esc">ESC</kbd>
          </div>

          <div ref="listEl" class="bm-search-body">
            <p v-if="!keyword.trim()" class="bm-search-tip">{{ t('common.searchEmpty') }}</p>
            <p v-else-if="!results.length" class="bm-search-tip">
              {{ t('common.searchNoResults', { keyword }) }}
            </p>
            <ul v-else class="bm-search-list" role="listbox">
              <li
                v-for="(item, index) in results"
                :key="`${item.path}#${item.hash}`"
                role="option"
                :aria-selected="index === activeIndex"
                :data-active="index === activeIndex"
                class="bm-search-item"
                @click="go(item)"
                @mouseenter="activeIndex = index"
              >
                <span class="bm-search-group">{{ groupLabels[item.group] ?? item.group }}</span>
                <span class="bm-search-title">
                  {{ item.title }}
                  <template v-if="item.heading">
                    <span class="bm-search-sep">›</span>
                    <span class="bm-search-heading">{{ item.heading }}</span>
                  </template>
                </span>
                <span v-if="item.description" class="bm-search-desc">{{ item.description }}</span>
              </li>
            </ul>
          </div>

          <div class="bm-search-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> {{ t('common.searchNavigate') }}</span>
            <span><kbd>↵</kbd> {{ t('common.searchJump') }}</span>
            <span><kbd>ESC</kbd> {{ t('common.searchClose') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bm-search-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 20px 20px;
  background: color-mix(in srgb, var(--color-foreground) 42%, transparent);
  backdrop-filter: blur(3px);
}
.bm-search-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  max-height: 68vh;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 28px 70px var(--color-shadow);
  overflow: hidden;
}
.bm-search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-divider);
  color: var(--color-foreground-tertiary);
}
.bm-search-input svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}
.bm-search-input input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-foreground);
}
.bm-search-input input::placeholder {
  color: var(--color-foreground-tertiary);
}
.bm-search-esc {
  flex-shrink: 0;
  padding: 2px 6px;
  border: 1px solid var(--color-divider);
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-foreground-tertiary);
}
.bm-search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  scrollbar-width: thin;
}
.bm-search-tip {
  margin: 0;
  padding: 26px 14px;
  text-align: center;
  font-size: 13.5px;
  color: var(--color-foreground-tertiary);
}
.bm-search-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bm-search-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 12px;
  border-radius: 9px;
  cursor: pointer;
}
.bm-search-item[data-active='true'] {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.bm-search-group {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-foreground-tertiary);
}
.bm-search-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-foreground);
}
.bm-search-item[data-active='true'] .bm-search-title {
  color: var(--color-primary);
}
.bm-search-sep {
  margin: 0 5px;
  opacity: 0.5;
}
.bm-search-heading {
  font-weight: 400;
  color: var(--color-foreground-secondary);
}
.bm-search-desc {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-foreground-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bm-search-foot {
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--color-divider);
  font-size: 11.5px;
  color: var(--color-foreground-tertiary);
}
.bm-search-foot kbd {
  margin-right: 3px;
  padding: 1px 5px;
  border: 1px solid var(--color-divider);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
}
.bm-search-enter-active,
.bm-search-leave-active {
  transition: opacity 0.18s ease;
}
.bm-search-enter-from,
.bm-search-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .bm-search-mask {
    padding: 8vh 12px 12px;
  }
  .bm-search-foot {
    display: none;
  }
}
</style>