<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '@/locales'

interface TocItem {
  id: string
  text: string
  level: number
}

const route = useRoute()
const items = ref<TocItem[]>([])
const activeId = ref('')

let headings: HTMLElement[] = []
let raf = 0
let mutation: MutationObserver | null = null
let collectTimer = 0

function update() {
  if (!headings.length) {
    activeId.value = ''
    return
  }
  let current = headings[0]
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= 100) current = heading
    else break
  }
  activeId.value = current.id
}

function collect() {
  const main = document.querySelector('.doc-main')
  if (!main) {
    headings = []
    items.value = []
    return
  }
  headings = Array.from(main.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id]'))
  items.value = headings.map(heading => ({
    id: heading.id,
    text: heading.textContent?.trim() ?? '',
    level: Number(heading.tagName.slice(1)),
  }))
  update()
}

function scheduleCollect() {
  window.clearTimeout(collectTimer)
  collectTimer = window.setTimeout(collect, 250)
}

function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: 'smooth' })
}

function handleClick(event: MouseEvent, id: string) {
  event.preventDefault()
  scrollToId(id)
  history.replaceState(null, '', `#${id}`)
}

function scrollToHash() {
  const hash = window.location.hash.slice(1)
  if (hash) scrollToId(decodeURIComponent(hash))
}

watch(
  () => route.path,
  () => {
    scheduleCollect()
    window.setTimeout(scrollToHash, 320)
  },
)

onMounted(() => {
  scheduleCollect()
  window.setTimeout(scrollToHash, 320)
  window.addEventListener('scroll', onScroll, { passive: true })
  const main = document.querySelector('.doc-main') ?? document.body
  mutation = new MutationObserver(scheduleCollect)
  mutation.observe(main, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
  window.clearTimeout(collectTimer)
  mutation?.disconnect()
})
</script>

<template>
  <nav v-if="items.length" class="bm-toc" :aria-label="t('common.tocTitle')">
    <p class="bm-mono-label bm-toc-title">{{ t('common.tocHeading') }}</p>
    <ul class="bm-toc-list">
      <li
        v-for="item in items"
        :key="item.id"
        class="bm-toc-item"
        :class="[`is-level-${item.level}`, { 'is-active': activeId === item.id }]"
      >
        <a :href="`#${item.id}`" @click="handleClick($event, item.id)">
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.bm-toc {
  position: relative;
  padding-left: 16px;
  border-left: 1px solid var(--color-divider);
}

.bm-toc-title {
  margin: 0 0 12px;
  color: var(--color-foreground-tertiary);
}

.bm-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bm-toc-item {
  position: relative;
  margin: 2px 0;
}
.bm-toc-item.is-level-3 {
  padding-left: 14px;
}
.bm-toc-item.is-level-4 {
  padding-left: 28px;
}

.bm-toc-item a {
  display: block;
  padding: 4px 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-foreground-tertiary);
  text-decoration: none;
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bm-toc-item a:hover {
  color: var(--color-foreground);
}
.bm-toc-item.is-active a {
  color: var(--color-primary);
  font-weight: 600;
}
.bm-toc-item.is-active::before {
  content: '';
  position: absolute;
  left: -17px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  border-radius: 2px;
  background: var(--color-primary);
}
</style>
