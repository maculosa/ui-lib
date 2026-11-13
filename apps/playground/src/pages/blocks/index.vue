<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import { t } from '@/locales'

interface BlockItem {
  name: string
  /** 描述文案的 i18n key，在模板中解析，保证切换语言时同步更新 */
  descKey: string
  url?: string
  tag: string
}

const blocks: BlockItem[] = [
  {
    name: 'Simple Login',
    descKey: 'blocks.simpleLoginDesc',
    url: '/examples/blocks/login/simple-login',
    tag: 'SIMPLE',
  },
  {
    name: 'Background Login',
    descKey: 'blocks.backgroundLoginDesc',
    url: '/examples/blocks/login/simple-bg-login',
    tag: 'BACKGROUND',
  },
  {
    name: 'Card Login',
    descKey: 'blocks.cardLoginDesc',
    url: '/examples/blocks/login/card-login',
    tag: 'CARD',
  },
  {
    name: 'Slot Login',
    descKey: 'blocks.slotLoginDesc',
    url: '/examples/blocks/login/slot-login',
    tag: 'SLOT',
  },
  {
    name: 'Two Column Login',
    descKey: 'blocks.twoColumnLoginDesc',
    url: '/examples/blocks/login/two-column-login',
    tag: 'COLUMN',
  },
  {
    name: 'Register',
    descKey: 'blocks.registerDesc',
    tag: 'PLANNED',
  },
  {
    name: 'Dashboard',
    descKey: 'blocks.dashboardDesc',
    tag: 'PLANNED',
  },
]
</script>

<template>
  <div class="blocks">
    <header class="blocks-head">
      <p class="bm-mono-label blocks-kicker">BLOCKS · GALLERY</p>
      <h1 class="blocks-title">{{ t('blocks.galleryTitle') }}</h1>
      <p class="blocks-desc">
        {{ t('blocks.galleryDescLead') }}
        <RouterLink to="/blocks/login">{{ t('blocks.galleryDescLink') }}</RouterLink>
        {{ t('blocks.galleryDescTail') }}
      </p>
    </header>

    <div class="blocks-grid">
      <article
        v-for="(block, index) in blocks"
        :key="block.name"
        class="block-card"
        :class="{ 'is-planned': !block.url }"
        :style="{ animationDelay: `${Math.min(index, 8) * 0.05}s` }"
      >
        <div v-if="block.url" class="block-thumb">
          <iframe :src="block.url" :title="t('blocks.previewTitle', { name: block.name })" loading="lazy" tabindex="-1" />
          <a :href="block.url" target="_blank" class="block-thumb-overlay" :aria-label="t('blocks.openFullExampleLabel', { name: block.name })">
            <span>
              {{ t('blocks.openFullExample') }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
              </svg>
            </span>
          </a>
        </div>
        <div v-else class="block-thumb is-empty bm-dot-grid">
          <span class="bm-mono-label">COMING SOON</span>
        </div>

        <div class="block-meta">
          <div class="block-meta-top">
            <h2 class="block-name">{{ block.name }}</h2>
            <span class="block-tag bm-mono-label" :class="{ 'is-planned': !block.url }">{{ block.tag }}</span>
          </div>
          <p class="block-desc">{{ t(block.descKey) }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blocks-head {
  margin-bottom: 32px;
}
.blocks-kicker {
  color: var(--color-primary);
}
.blocks-title {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.2;
  color: var(--color-foreground);
}
.blocks-desc {
  margin: 14px 0 0;
  max-width: 640px;
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}
.blocks-desc a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.block-card {
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  overflow: hidden;
  animation: bm-block-in 0.55s cubic-bezier(0.19, 1, 0.22, 1) both;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.block-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-divider));
  box-shadow: 0 16px 44px var(--color-shadow);
  transform: translateY(-3px);
}
.block-card.is-planned {
  border-style: dashed;
  background: transparent;
}
.block-card.is-planned:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-divider);
}

@keyframes bm-block-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.block-thumb {
  position: relative;
  height: 280px;
  overflow: hidden;
  border-bottom: 1px solid var(--color-divider);
  background: #f6f4ee;
}
.block-thumb iframe {
  width: 200%;
  height: 200%;
  border: 0;
  transform: scale(0.5);
  transform-origin: top left;
  pointer-events: none;
}
.block-thumb.is-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-secondary);
  border-bottom-style: dashed;
}
.block-thumb.is-empty .bm-mono-label {
  color: var(--color-foreground-tertiary);
}

.block-thumb-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 14px;
  background: linear-gradient(to top, color-mix(in srgb, #141310 45%, transparent), transparent 55%);
  opacity: 0;
  transition: opacity 0.25s ease;
  text-decoration: none;
}
.block-card:hover .block-thumb-overlay,
.block-thumb-overlay:focus-visible {
  opacity: 1;
}
.block-thumb-overlay span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
}
.block-thumb-overlay svg {
  width: 14px;
  height: 14px;
}

.block-meta {
  padding: 18px 20px 20px;
}
.block-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.block-name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-foreground);
}
.block-tag {
  color: var(--color-primary);
}
.block-tag.is-planned {
  color: var(--color-warning);
}
.block-desc {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.75;
  color: var(--color-foreground-secondary);
}

@media (max-width: 900px) {
  .blocks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
