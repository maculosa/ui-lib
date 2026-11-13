<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CatalogItem {
  name: string
  desc: string
  category: string
  url?: string
  tags: string[]
}

const categories = ['全部', '布局', '数据录入', '数据展示', '通用']
const activeCategory = ref('全部')
const keyword = ref('')

const items: CatalogItem[] = [
  {
    name: 'ProTable',
    desc: '配置化数据表格：搜索表单、工具栏、列设置、密度切换与自适应高度一体成型。',
    category: '数据展示',
    url: '/procomponent/ProTable',
    tags: ['CRUD', 'Schema'],
  },
  {
    name: 'ProForm',
    desc: '列配置驱动的表单：校验、远程枚举、级联联动与栅格布局开箱即用。',
    category: '数据录入',
    url: '/procomponent/ProForm',
    tags: ['Schema', 'Validate'],
  },
  {
    name: 'ProLayout',
    desc: '中后台侧边栏布局：菜单、折叠与内容容器统一管理。',
    category: '布局',
    url: '/procomponent/ProLayout',
    tags: ['Admin', 'Menu'],
  },
  {
    name: 'ProDescriptions',
    desc: '描述列表：以配置渲染详情字段，支持自定义渲染与布局控制。',
    category: '数据展示',
    url: '/procomponent/ProDescriptions',
    tags: ['Detail'],
  },
  {
    name: 'ProTree',
    desc: '树形控件：勾选、展开与业务数据结构的快速搭建。',
    category: '数据展示',
    url: '/procomponent/ProTree',
    tags: ['Tree'],
  },
  {
    name: 'ProText',
    desc: '业务文本：复制、省略与格式化一行配置搞定。',
    category: '数据展示',
    url: '/procomponent/ProText',
    tags: ['Copy', 'Ellipsis'],
  },
  {
    name: 'Watermark',
    desc: '水印：文本水印覆盖局部或全屏，守护敏感页面。',
    category: '通用',
    url: '/procomponent/watermark',
    tags: ['Security'],
  },
  {
    name: 'NaiveProvider',
    desc: '全局配置聚合：message / dialog / notification / loading-bar 一次注入。',
    category: '通用',
    url: '/procomponent/naive-provider',
    tags: ['Provider'],
  },
  {
    name: 'ModalForm',
    desc: '弹窗表单：ProForm 与 Modal 的组合封装，提交即关闭。',
    category: '数据录入',
    tags: ['Modal', 'Form'],
  },
  {
    name: 'DrawerForm',
    desc: '抽屉表单：侧滑面板承载复杂表单，保留页面上下文。',
    category: '数据录入',
    tags: ['Drawer', 'Form'],
  },
  {
    name: 'StepsForm',
    desc: '分步表单：把长流程拆成可校验的步骤。',
    category: '数据录入',
    tags: ['Steps'],
  },
  {
    name: 'QueryFilter',
    desc: '查询过滤：声明式筛选表单，折叠布局与远程枚举。',
    category: '数据录入',
    tags: ['Filter'],
  },
  {
    name: 'LiteFilter',
    desc: '轻量筛选：行内快速过滤，适合紧凑工具栏。',
    category: '数据录入',
    tags: ['Filter', 'Lite'],
  },
  {
    name: 'LoginForm',
    desc: '登录表单：多布局模式与可配置 schema。',
    category: '数据录入',
    tags: ['Auth'],
  },
  {
    name: 'ProList',
    desc: '分页列表：卡片式数据流与加载更多。',
    category: '数据展示',
    tags: ['List'],
  },
  {
    name: 'TextClamp',
    desc: '多行截断文本：展开/收起与复制。',
    category: '数据展示',
    tags: ['Text'],
  },
  {
    name: 'LinkDiagram',
    desc: '拓扑图：油罐-加油机关系可视化。',
    category: '数据展示',
    tags: ['Diagram'],
  },
  {
    name: 'ProTabs',
    desc: '选项卡容器：页签缓存与路由联动。',
    category: '布局',
    tags: ['Tabs'],
  },
  {
    name: 'Actions',
    desc: '可折叠操作按钮组：超出宽度自动收纳。',
    category: '布局',
    tags: ['Actions'],
  },
  {
    name: 'Tour',
    desc: '漫游引导：分步高亮页面元素。',
    category: '通用',
    tags: ['Guide'],
  },
]

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return items.filter(item => {
    const inCategory = activeCategory.value === '全部' || item.category === activeCategory.value
    const inKeyword =
      !kw ||
      item.name.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw) ||
      item.tags.some(tag => tag.toLowerCase().includes(kw))
    return inCategory && inKeyword
  })
})

const readyCount = items.filter(item => item.url).length
const plannedCount = items.length - readyCount
</script>

<template>
  <div class="catalog">
    <header class="catalog-head">
      <p class="bm-mono-label catalog-kicker">PROCOMPONENT · CATALOG</p>
      <h1 class="catalog-title">组件目录</h1>
      <p class="catalog-desc">
        一份配置驱动的中后台组件集。已就绪的组件附带完整文档与可交互示例，规划中的组件正在打磨。
      </p>
      <dl class="catalog-stats">
        <div><dt>{{ readyCount }}</dt><dd>可用组件</dd></div>
        <div><dt>{{ plannedCount }}</dt><dd>规划中</dd></div>
        <div><dt>{{ categories.length - 1 }}</dt><dd>分类</dd></div>
      </dl>
    </header>

    <div class="catalog-toolbar">
      <label class="catalog-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.8-3.8" />
        </svg>
        <input v-model="keyword" type="text" placeholder="搜索组件、能力或标签…" />
      </label>
      <div class="catalog-chips" role="tablist" aria-label="按分类筛选">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="activeCategory === cat"
          :class="{ 'is-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
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
          <span class="catalog-card-index bm-mono-label">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="catalog-card-status" :class="item.url ? 'is-ready' : 'is-planned'">
            {{ item.url ? '可用' : '规划中' }}
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
      <p>没有匹配「{{ keyword }}」的组件，换个关键词试试。</p>
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
  color: var(--color-success);
}
.catalog-card-status.is-planned {
  background: color-mix(in srgb, var(--color-warning) 14%, transparent);
  color: var(--color-warning);
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
