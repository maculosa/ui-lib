<script setup lang="ts">
import { computed, ref } from 'vue'
import CodePreview from '@/components/CodePreview/index.vue'

const props = defineProps<{
  title: string
  description?: string
  raw: string
}>()

const tab = ref<'preview' | 'code'>('preview')
const code = computed(() => props.raw.trim())
</script>

<template>
  <section class="bm-ui-demo">
    <header class="bm-ui-demo-head">
      <div class="bm-ui-demo-meta">
        <h3 class="bm-ui-demo-title">{{ title }}</h3>
        <p v-if="description" class="bm-ui-demo-desc">{{ description }}</p>
      </div>
      <div class="bm-ui-demo-tabs" role="tablist" aria-label="预览与代码切换">
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'preview'"
          :class="{ 'is-active': tab === 'preview' }"
          @click="tab = 'preview'"
        >
          预览
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="tab === 'code'"
          :class="{ 'is-active': tab === 'code' }"
          @click="tab = 'code'"
        >
          代码
        </button>
      </div>
    </header>

    <div v-show="tab === 'preview'" class="bm-ui-demo-preview bm-dot-grid">
      <slot />
    </div>

    <CodePreview v-if="tab === 'code'" :code="code" />
  </section>
</template>

<style scoped>
.bm-ui-demo {
  margin: 24px 0;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.bm-ui-demo:hover {
  border-color: color-mix(in srgb, var(--color-primary) 32%, var(--color-divider));
  box-shadow: 0 12px 40px var(--color-shadow);
}

.bm-ui-demo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px dashed var(--color-divider);
}

.bm-ui-demo-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 600;
  color: var(--color-foreground);
}

.bm-ui-demo-desc {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-foreground-tertiary);
}

.bm-ui-demo-tabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-background-secondary);
  flex-shrink: 0;
}
.bm-ui-demo-tabs button {
  padding: 5px 16px;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-size: 12.5px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.bm-ui-demo-tabs button:hover {
  color: var(--color-foreground);
}
.bm-ui-demo-tabs button.is-active {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.bm-ui-demo-preview {
  padding: 24px;
  background-color: var(--color-background-secondary);
}

.bm-ui-demo :deep(.code-preview) {
  border: none;
  border-radius: 0;
}

@media (max-width: 640px) {
  .bm-ui-demo-head {
    flex-direction: column;
    gap: 12px;
  }
  .bm-ui-demo-preview {
    padding: 16px;
  }
}
</style>
