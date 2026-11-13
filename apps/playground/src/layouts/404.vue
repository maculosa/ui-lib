<script setup lang="ts">
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/layout/index.vue'
import Header from './header/index.vue'

const router = useRouter()
</script>

<template>
  <Layout>
    <Header />
    <div class="notfound-page">
      <div class="notfound-card bm-corner-marks">
        <svg class="notfound-mark" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="2" y="2" width="60" height="60" rx="14" fill="var(--color-primary)" />
          <path
            d="M18 26 L22 14 L29 22 Q32 21 35 22 L42 14 L46 26 Q48 30 48 34 Q48 46 32 46 Q16 46 16 34 Q16 30 18 26 Z"
            fill="#f4f1ea"
          />
          <circle cx="26" cy="32" r="2.4" fill="#141310" />
          <circle cx="38" cy="32" r="2.4" fill="#141310" />
          <path
            d="M30 38 Q32 40 34 38"
            stroke="#141310"
            stroke-width="1.8"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
        <p class="bm-mono-label notfound-kicker">ROUTE · NOT FOUND</p>
        <h1 class="notfound-code">404<span class="notfound-dot">.</span></h1>
        <p class="notfound-message">页面不存在或已被移动。检查一下地址，或返回首页继续浏览组件工坊。</p>
        <div class="notfound-actions">
          <button type="button" class="notfound-btn primary" @click="router.push('/')">
            返回首页
          </button>
          <button type="button" class="notfound-btn ghost" @click="router.back()">返回上一页</button>
        </div>
      </div>
      <router-view />
    </div>
  </Layout>
</template>

<style scoped>
.notfound-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: calc(var(--layout-header-height) + 48px) 20px 48px;
}

.notfound-card {
  position: relative;
  max-width: 520px;
  width: 100%;
  text-align: center;
  padding: 56px 40px;
  border: 1px solid var(--color-divider);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 30px 80px -50px var(--color-shadow);
}

.notfound-mark {
  width: 64px;
  height: 64px;
  margin-bottom: 22px;
}

.notfound-kicker {
  color: var(--color-primary);
}

.notfound-code {
  margin: 12px 0 10px;
  font-family: var(--font-serif);
  font-size: 72px;
  font-weight: 400;
  line-height: 1;
  color: var(--color-foreground);
}

.notfound-dot {
  color: var(--color-primary);
}

.notfound-message {
  margin: 0 auto 30px;
  max-width: 360px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}

.notfound-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.notfound-btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.notfound-btn:active {
  transform: translateY(1px);
}

.notfound-btn.primary {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

.notfound-btn.primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.notfound-btn.ghost {
  border: 1px solid var(--color-divider);
  background: transparent;
  color: var(--color-foreground);
}

.notfound-btn.ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .notfound-card {
    padding: 40px 24px;
  }

  .notfound-code {
    font-size: 56px;
  }
}
</style>