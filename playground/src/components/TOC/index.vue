<script setup lang="ts">
import { ref, onMounted } from 'vue'

const headers = ref<HTMLElement[]>([])
const activeId = ref('')

onMounted(() => {
  headers.value = Array.from(document.querySelectorAll('h2, h3, h4'))

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, { threshold: 0.5 })

  headers.value.forEach((header) => observer.observe(header))
})

function getLevel(tag: string): number {
  return parseInt(tag.replace('H', '')) - 1
}

const currentPos = ref('0px')
</script>

<template>
  <nav class="toc">
    <div class="outline-marker" :style="{ top: currentPos, opacity: 1 }"></div>
    <div class="toc-title">目录</div>
    <ul class="toc-list">
      <li v-for="header in headers" :key="header.id" :class="[
        `level-${getLevel(header.tagName)}`,
        'cursor-pointer',
        { active: activeId === header.id }
      ]">
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
  transition: top 0.25s cubic-bezier(0, 1 0.5, 1), background-color 0.5s, opacity 0.25s;
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

.toc-list li a:hover {
  @apply bg-primary;
}

.toc-list li.active a {
  @apply text-primary;
}

.toc-list li a:hover {
  @apply text-primary;
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
  @apply text-primary;
}
</style>