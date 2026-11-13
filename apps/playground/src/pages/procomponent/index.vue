<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { locale, t, toLocalePath } from '@/locales'

const categoryKeys = ['all', 'layout', 'entry', 'display', 'general'] as const
type CategoryKey = (typeof categoryKeys)[number]

interface CatalogItem {
  name: string
  descKey: string
  category: Exclude<CategoryKey, 'all'>
  url?: string
  tags: string[]
}

const catalog: CatalogItem[] = [
  {
    name: 'ProTable',
    descKey: 'proTable',
    category: 'display',
    url: '/procomponent/ProTable',
    tags: ['CRUD', 'Schema'],
  },
  {
    name: 'ProForm',
    descKey: 'proForm',
    category: 'entry',
    url: '/procomponent/ProForm',
    tags: ['Schema', 'Validate'],
  },
  {
    name: 'ProLayout',
    descKey: 'proLayout',
    category: 'layout',
    url: '/procomponent/ProLayout',
    tags: ['Admin', 'Menu'],
  },
  {
    name: 'ProDescriptions',
    descKey: 'proDescriptions',
    category: 'display',
    url: '/procomponent/ProDescriptions',
    tags: ['Detail'],
  },
  {
    name: 'ProTree',
    descKey: 'proTree',
    category: 'display',
    url: '/procomponent/ProTree',
    tags: ['Tree'],
  },
  {
    name: 'ProText',
    descKey: 'proText',
    category: 'display',
    url: '/procomponent/ProText',
    tags: ['Copy', 'Ellipsis'],
  },
  {
    name: 'Watermark',
    descKey: 'watermark',
    category: 'general',
    url: '/procomponent/watermark',
    tags: ['Security'],
  },
  {
    name: 'NaiveProvider',
    descKey: 'naiveProvider',
    category: 'general',
    url: '/procomponent/naive-provider',
    tags: ['Provider'],
  },
  {
    name: 'ModalForm',
    descKey: 'modalForm',
    category: 'entry',
    tags: ['Modal', 'Form'],
  },
  {
    name: 'DrawerForm',
    descKey: 'drawerForm',
    category: 'entry',
    tags: ['Drawer', 'Form'],
  },
  {
    name: 'StepsForm',
    descKey: 'stepsForm',
    category: 'entry',
    tags: ['Steps'],
  },
  {
    name: 'QueryFilter',
    descKey: 'queryFilter',
    category: 'entry',
    tags: ['Filter'],
  },
  {
    name: 'LiteFilter',
    descKey: 'liteFilter',
    category: 'entry',
    tags: ['Filter', 'Lite'],
  },
  {
    name: 'LoginForm',
    descKey: 'loginForm',
    category: 'entry',
    tags: ['Auth'],
  },
  {
    name: 'ProList',
    descKey: 'proList',
    category: 'display',
    tags: ['List'],
  },
  {
    name: 'TextClamp',
    descKey: 'textClamp',
    category: 'display',
    tags: ['Text'],
  },
  {
    name: 'LinkDiagram',
    descKey: 'linkDiagram',
    category: 'display',
    tags: ['Diagram'],
  },
  {
    name: 'ProTabs',
    descKey: 'proTabs',
    category: 'layout',
    tags: ['Tabs'],
  },
  {
    name: 'Actions',
    descKey: 'actions',
    category: 'layout',
    tags: ['Actions'],
  },
  {
    name: 'Tour',
    descKey: 'tour',
    category: 'general',
    tags: ['Guide'],
  },
]

const categories = computed(() =>
  categoryKeys.map(key => ({ key, label: t(`catalog.cat_${key}`) })),
)
const activeCategory = ref<CategoryKey>('all')
const keyword = ref('')

const items = computed(() =>
  catalog.map(item => ({
    ...item,
    desc: t(`catalog.desc_${item.descKey}`),
    url: item.url ? toLocalePath(item.url, locale.value) : undefined,
  })),
)

const canonicalNo = new Map(catalog.map((item, i) => [item.name, String(i + 1).padStart(2, '0')]))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return items.value.filter(item => {
    const inCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const inKeyword =
      !kw ||
      item.name.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw) ||
      item.tags.some(tag => tag.toLowerCase().includes(kw))
    return inCategory && inKeyword
  })
})

const readyCount = catalog.filter(item => item.url).length
const plannedCount = catalog.length - readyCount
</script>

<template>
  <div class="catalog">
    <header class="catalog-head">
      <p class="bm-mono-label catalog-kicker">PROCOMPONENT · CATALOG</p>
      <h1 class="catalog-title">{{ t('catalog.title') }}</h1>
      <p class="catalog-desc">
        {{ t('catalog.desc') }}
      </p>
      <dl class="catalog-stats">
        <div><dt>{{ readyCount }}</dt><dd>{{ t('catalog.statReady') }}</dd></div>
        <div><dt>{{ plannedCount }}</dt><dd>{{ t('catalog.statPlanned') }}</dd></div>
        <div><dt>{{ categories.length - 1 }}</dt><dd>{{ t('catalog.statCategories') }}</dd></div>
      </dl>
    </header>

    <div class="catalog-toolbar">
      <label class="catalog-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.8-3.8" />
        </svg>
        <input v-model="keyword" type="text" :aria-label="t('catalog.searchAria')" :placeholder="t('catalog.searchPlaceholder')" />
      </label>
      <div class="catalog-chips" role="group" :aria-label="t('catalog.filterAria')">
        <button
          v-for="cat in categories"
          :key="cat.key"
          type="button"
          :aria-pressed="activeCategory === cat.key"
          :class="{ 'is-active': activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div v-if="filtered.length" class="catalog-grid">
      <component
        :is="item.url ? 'RouterLink' : 'div'"
        v-for="(item, index) in filtered"
        :key="item.name"
        :to="item.url"
        class="catalog-card"
        :class="{ 'is-planned': !item.url }"
        :style="{ animationDelay: `${Math.min(index, 12) * 0.04}s` }"
      >
        <div class="catalog-card-top">
          <span class="catalog-card-index bm-mono-label">{{ canonicalNo.get(item.name) }}</span>
          <span class="catalog-card-status" :class="item.url ? 'is-ready' : 'is-planned'">
            {{ item.url ? t('catalog.statusReady') : t('catalog.statusPlanned') }}
          </span>
        </div>
        <h2 class="catalog-card-name">{{ item.name }}</h2>
        <p class="catalog-card-desc">{{ item.desc }}</p>
        <div class="catalog-card-foot">
          <ul class="catalog-card-tags">
            <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
          </ul>
          <svg
            v-if="item.url"
            class="catalog-card-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </component>
    </div>

    <div v-else class="catalog-empty">
      <p class="bm-mono-label">NO MATCH</p>
      <p>{{ t('catalog.empty', { keyword }) }}</p>
    </div>
  </div>
</template>

<style scoped>
.catalog-head {
  margin-bottom: 32px;
}
.catalog-kicker {
  color: var(--color-primary);
}
.catalog-title {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.2;
  color: var(--color-foreground);
}
.catalog-desc {
  margin: 14px 0 0;
  max-width: 620px;
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}
.catalog-stats {
  display: flex;
  gap: 36px;
  margin: 24px 0 0;
  padding-top: 18px;
  border-top: 1px dashed var(--color-divider);
  width: fit-content;
}
.catalog-stats dt {
  font-family: var(--font-mono);
  font-size: 22px;
  color: var(--color-foreground);
}
.catalog-stats dd {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-foreground-tertiary);
}

.catalog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.catalog-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 240px;
  max-width: 380px;
  padding: 9px 14px;
  border: 1px solid var(--color-divider);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-foreground-tertiary);
  transition: border-color 0.2s ease;
}
.catalog-search:focus-within {
  border-color: var(--color-primary);
}
.catalog-search svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.catalog-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13.5px;
  color: var(--color-foreground);
}
.catalog-search input::placeholder {
  color: var(--color-foreground-tertiary);
}

.catalog-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.catalog-chips button {
  padding: 7px 16px;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 13px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.catalog-chips button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.catalog-chips button.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  text-decoration: none;
  animation: bm-card-in 0.55s cubic-bezier(0.19, 1, 0.22, 1) both;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.catalog-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-divider));
  box-shadow: 0 16px 44px var(--color-shadow);
  transform: translateY(-3px);
}
.catalog-card.is-planned {
  border-style: dashed;
  background: transparent;
}
.catalog-card.is-planned:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-divider);
}

@keyframes bm-card-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.catalog-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.catalog-card-index {
  color: var(--color-foreground-tertiary);
}
.catalog-card-status {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.catalog-card-status.is-ready {
  background: color-mix(in srgb, var(--color-success) 14%, transparent);
  color: color-mix(in srgb, var(--color-success) 62%, var(--color-foreground));
}
.catalog-card-status.is-planned {
  background: color-mix(in srgb, var(--color-warning) 14%, transparent);
  color: color-mix(in srgb, var(--color-warning) 46%, var(--color-foreground));
}

.catalog-card-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-foreground);
}
.catalog-card-desc {
  margin: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.75;
  color: var(--color-foreground-secondary);
}
.catalog-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
}
.catalog-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}
.catalog-card-tags li {
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--color-fill);
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--color-foreground-tertiary);
}
.catalog-card-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-primary);
  transition: transform 0.25s ease;
}
.catalog-card:hover .catalog-card-arrow {
  transform: translateX(4px);
}

.catalog-empty {
  padding: 56px 24px;
  border: 1px dashed var(--color-divider);
  border-radius: 14px;
  text-align: center;
  color: var(--color-foreground-secondary);
}
.catalog-empty .bm-mono-label {
  color: var(--color-primary);
  margin-bottom: 8px;
}

@media (max-width: 1279px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 720px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }
  .catalog-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .catalog-search {
    max-width: none;
  }
}
</style>
