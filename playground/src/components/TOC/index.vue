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
</script>

<template>
  <nav class="toc">
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
  padding: 16px;
}

.toc-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
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
  transition: color 0.2s;
}

.toc-list li.active a {
  color: #409eff;
}

.toc-list li a:hover {
  color: #409eff;
}

.level-1 {
  padding-left: 0;
}

.level-2 {
  padding-left: 16px;
}

.level-3 {
  padding-left: 32px;
}
</style>