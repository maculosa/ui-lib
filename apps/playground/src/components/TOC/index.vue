<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const headers = ref<HTMLElement[]>([])
const activeId = ref('')
const route = useRoute()

// 初始化目录
function initTOC() {
  // 清除旧的标题和观察器
  headers.value = []

  // 获取新的标题元素，包括嵌套在组件内部的
  headers.value = Array.from(document.querySelectorAll('h2, h3, h4'))

  // 创建新的观察器
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { threshold: 0.5 }
  )

  // 观察所有标题
  headers.value.forEach(header => observer.observe(header))
}

// 监听路由变化，重新初始化目录
watchEffect(() => {
  // 使用route.path来触发监听
  route.path
  // 路由变化时，等待DOM更新后再初始化TOC，增加延迟确保组件完全渲染
  setTimeout(() => {
    initTOC()
    // 检查URL中是否有锚点，如果有则滚动到对应位置
    const hash = window.location.hash
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 500) // 增加延迟到500ms，确保Demo组件完全渲染
})

// 组件挂载时初始化目录
onMounted(() => {
  // 初始加载时增加延迟，确保所有组件完全渲染
  setTimeout(() => {
    initTOC()
    // 检查URL中是否有锚点
    const hash = window.location.hash
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 500)

  // 监听页面内容变化，使用MutationObserver
  const contentObserver = new MutationObserver(mutations => {
    // 只要内容发生变化，就重新初始化TOC
    initTOC()
  })

  // 观察主内容区域
  const mainContent = document.querySelector('.main-content') || document.body
  contentObserver.observe(mainContent, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  })

  // 监听点击事件，处理锚点导航
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      const href = target.getAttribute('href')
      if (href) {
        const id = href.slice(1)
        const element = document.getElementById(id)
        if (element) {
          // 延迟一下，确保TOC已经更新
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      }
    }
  })
})

function getLevel(tag: string): number {
  return parseInt(tag.replace('H', '')) - 1
}

const currentPos = ref('0')
</script>

<template>
  <nav class="toc">
    <div class="outline-marker" :style="{ top: `${currentPos}px`, opacity: 1 }"></div>
    <div class="toc-title">目录</div>
    <ul class="toc-list">
      <li
        v-for="header in headers"
        :key="header.id"
        :class="[
          `level-${getLevel(header.tagName)}`,
          'cursor-pointer',
          { active: activeId === header.id },
        ]"
      >
        <a :href="`#${header.id}`">{{ header.textContent }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc {
  position: sticky;
  top: var(--layout-margin-top);
  padding-left: 16px;
  border-left: 1px solid #ccc;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  opacity: 0;
  width: 2px;
  height: 18px;
  background-color: skyblue;
  border-radius: 2px;
  transition:
    top 0.25s cubic-bezier(0, 1 0.5, 1),
    background-color 0.5s,
    opacity 0.25s;
}

.toc-title {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin: 4px 0;
  line-height: 1.6;
}

.toc-list li a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  line-height: 2;
  transition: color 0.2s;
}

.toc-list li.active a {
  /* @apply text-primary; */
  color: #4285f4;
}

.toc-list li a:hover {
  /* @apply text-primary; */
  color: #4285f4;
}

.level-1 {
  font-weight: 600;
  padding-left: 0;
}

.level-2 {
  padding-left: 16px;
}

.level-3 {
  padding-left: 32px;
}

.dark .toc-list li a {
  color: #ddd;
}

.dark .toc-list li.active a {
  /* @apply text-primary; */
  color: #4285f4;
}
</style>
