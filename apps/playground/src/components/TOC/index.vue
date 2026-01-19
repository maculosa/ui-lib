<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const headers = ref<HTMLElement[]>([])
const activeId = ref('')
const route = useRoute()

function initTOC() {
  headers.value = []
  headers.value = Array.from(document.querySelectorAll('h2, h3, h4'))

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

  headers.value.forEach(header => observer.observe(header))
}

watchEffect(() => {
  route.path
  setTimeout(() => {
    initTOC()
    const hash = window.location.hash
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 500)
})

onMounted(() => {
  setTimeout(() => {
    initTOC()
    const hash = window.location.hash
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, 500)

  const contentObserver = new MutationObserver(() => {
    initTOC()
  })

  const mainContent = document.querySelector('.main-content') || document.body
  contentObserver.observe(mainContent, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  })

  document.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      const href = target.getAttribute('href')
      if (href) {
        const id = href.slice(1)
        const element = document.getElementById(id)
        if (element) {
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
  <nav class="toc sticky top-[92px] pl-4 border-l border-zinc-300 dark:border-zinc-700">
    <div class="outline-marker absolute -left-px opacity-0 w-0.5 h-4.5 bg-sky-500 rounded-sm transition-all duration-250" :style="{ top: `${currentPos}px`, opacity: 1 }"></div>
    <div class="toc-title text-sm font-semibold leading-8">目录</div>
    <ul class="toc-list list-none p-0 m-0">
      <li
        v-for="header in headers"
        :key="header.id"
        :class="[
          `level-${getLevel(header.tagName)}`,
          'cursor-pointer my-1 leading-6',
          { active: activeId === header.id },
        ]"
      >
        <a
          :href="`#${header.id}`"
          class="text-zinc-600 dark:text-zinc-400 no-underline text-sm leading-8 transition-colors duration-200 hover:text-primary"
          :class="{ 'text-primary font-medium': activeId === header.id }"
        >
          {{ header.textContent }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
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
</style>
