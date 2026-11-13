<script setup lang="ts">
import { reactive, ref } from 'vue'

const fonts = reactive([
  {
    id: 'serif',
    name: 'DM Serif Display',
    role: '展示标题',
    varName: '--font-serif',
    family: "var(--font-serif)",
    size: 40,
    min: 20,
    max: 72,
    sample: '组件工坊 Atelier',
    charset: 'AaBbGgQqRr 0123456789 永字八法 · 衬线气质',
  },
  {
    id: 'sans',
    name: 'DM Sans',
    role: '界面正文',
    varName: '--font-sans',
    family: "var(--font-sans)",
    size: 27,
    min: 14,
    max: 48,
    sample: '配置化驱动的企业级组件',
    charset: 'AaBbGgQq 0123456789 敏捷的棕色狐狸 · 中文回退 PingFang',
  },
  {
    id: 'mono',
    name: 'DM Mono',
    role: '标签 / 代码',
    varName: '--font-mono',
    family: "var(--font-mono)",
    size: 21,
    min: 12,
    max: 40,
    sample: 'const theme = useTokens()',
    charset: '0O1lI {}[]()<>=+-*/&| 0123456789 等宽对齐',
  },
])

const customText = ref('')

const typeScale = [
  { label: '展示 H1', size: 34, family: 'var(--font-serif)', weight: 400, text: '设计基座' },
  { label: '章节 H2', size: 25, family: 'var(--font-serif)', weight: 400, text: '色彩令牌' },
  { label: '小节 H3', size: 18, family: 'var(--font-sans)', weight: 600, text: '字体系统' },
  { label: '正文 Body', size: 14.5, family: 'var(--font-sans)', weight: 400, text: '所有色彩以 CSS 变量暴露，随主题一键切换。' },
  { label: '辅助 Small', size: 12.5, family: 'var(--font-sans)', weight: 400, text: '次级描述与元信息' },
  { label: '标注 Mono', size: 11, family: 'var(--font-mono)', weight: 400, text: 'COLOR TOKENS · 18' },
]

const radii = [0, 2, 4, 6, 8, 12, 16, 24]
const spaces = [4, 8, 12, 16, 24, 32, 48]
const elevations = [
  { label: 'E0 · 贴合', shadow: 'none', border: true },
  { label: 'E1 · 卡片', shadow: '0 2px 8px var(--color-shadow)', border: true },
  { label: 'E2 · 浮层', shadow: '0 12px 32px var(--color-shadow)', border: false },
  { label: 'E3 · 弹窗', shadow: '0 24px 64px var(--color-shadow)', border: false },
]
</script>

<template>
  <section class="type bm-corner-marks" aria-label="字体与度量系统">
    <header class="type-head">
      <div class="type-title">
        <span class="bm-mono-label">TYPE &amp; SCALE · 字体与度量</span>
        <span class="type-sub">三套本地 woff2 字体，输入文字、拖动字号即时预览</span>
      </div>
      <label class="type-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7V5h16v2M9 19h6M12 5v14" />
        </svg>
        <input v-model="customText" type="text" placeholder="输入预览文字…" aria-label="自定义预览文字" maxlength="40" />
      </label>
    </header>

    <div class="type-specimens">
      <div v-for="f in fonts" :key="f.id" class="specimen-panel">
        <div class="specimen-top">
          <span class="specimen-role">{{ f.role }}</span>
          <span class="specimen-var bm-mono-label">{{ f.varName }}</span>
        </div>
        <div class="specimen-live" :style="{ fontFamily: f.family, fontSize: f.size + 'px' }">
          {{ customText || f.sample }}
        </div>
        <div class="specimen-name">{{ f.name }}</div>
        <div class="specimen-control">
          <span class="specimen-size-label">字号 <em>{{ f.size }}px</em></span>
          <input v-model.number="f.size" type="range" :min="f.min" :max="f.max" step="1" :aria-label="`${f.name} 字号`" />
        </div>
        <div class="specimen-charset" :style="{ fontFamily: f.family }">{{ f.charset }}</div>
      </div>
    </div>

    <div class="type-divider">
      <span class="bm-mono-label">TYPE SCALE · 字号阶梯</span>
      <span class="type-rule" aria-hidden="true"></span>
    </div>
    <div class="type-scale">
      <div v-for="s in typeScale" :key="s.label" class="scale-row">
        <span class="scale-tag bm-mono-label">{{ s.label }} · {{ s.size }}px</span>
        <span class="scale-sample" :style="{ fontFamily: s.family, fontSize: s.size + 'px', fontWeight: s.weight }">{{ s.text }}</span>
      </div>
    </div>

    <div class="type-divider">
      <span class="bm-mono-label">MEASURE · 圆角 / 间距 / 高度</span>
      <span class="type-rule" aria-hidden="true"></span>
    </div>
    <div class="type-measures">
      <div class="measure-block">
        <span class="measure-title">圆角 Radius</span>
        <div class="radius-row">
          <div v-for="r in radii" :key="r" class="radius-item">
            <span class="radius-box" :style="{ borderRadius: r + 'px' }"></span>
            <span class="radius-label bm-mono-label">{{ r }}</span>
          </div>
        </div>
      </div>
      <div class="measure-block">
        <span class="measure-title">间距 Spacing</span>
        <div class="space-list">
          <div v-for="s in spaces" :key="s" class="space-item">
            <span class="space-bar" :style="{ width: s + 'px' }"></span>
            <span class="space-label bm-mono-label">{{ s }}px</span>
          </div>
        </div>
      </div>
      <div class="measure-block">
        <span class="measure-title">层级 Elevation</span>
        <div class="elev-list">
          <div
            v-for="e in elevations"
            :key="e.label"
            class="elev-card"
            :style="{ boxShadow: e.shadow, borderColor: e.border ? 'var(--color-divider)' : 'transparent' }"
          >
            <span class="elev-label bm-mono-label">{{ e.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.type {
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px var(--color-shadow);
  overflow: hidden;
}
.type-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 18px;
  border-bottom: 1px dashed var(--color-divider);
}
.type-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.type-sub {
  font-size: 12.5px;
  color: var(--color-foreground-secondary);
}
.type-input {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border: 1px solid var(--color-input-border);
  border-radius: 9px;
  background: var(--color-input);
  color: var(--color-foreground-tertiary);
  transition: border-color 0.2s ease;
}
.type-input:focus-within {
  border-color: var(--color-primary);
}
.type-input svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.type-input input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--color-foreground);
  width: 180px;
}
.type-input input::placeholder {
  color: var(--color-foreground-tertiary);
}
.type-specimens {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
}
.specimen-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-right: 1px solid var(--color-divider);
  min-width: 0;
}
.specimen-panel:last-child {
  border-right: none;
}
.specimen-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.specimen-role {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-foreground);
}
.specimen-var {
  color: var(--color-primary);
}
.specimen-live {
  min-height: 92px;
  display: flex;
  align-items: center;
  line-height: 1.18;
  color: var(--color-foreground);
  word-break: break-word;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-divider);
  transition: font-size 0.15s ease;
}
.specimen-name {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-foreground-secondary);
}
.specimen-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.specimen-size-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--color-foreground-secondary);
}
.specimen-size-label em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--color-primary);
}
.specimen-control input[type='range'] {
  width: 100%;
  height: 20px;
  accent-color: var(--color-primary);
  cursor: pointer;
}
.specimen-charset {
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-foreground-tertiary);
  word-break: break-word;
}
.type-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px 0;
}
.type-rule {
  flex: 1;
  height: 1px;
  background: var(--color-divider);
}
.type-scale {
  padding: 12px 18px 6px;
  display: flex;
  flex-direction: column;
}
.scale-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--color-divider);
}
.scale-row:last-child {
  border-bottom: none;
}
.scale-tag {
  flex-shrink: 0;
  width: 132px;
}
.scale-sample {
  color: var(--color-foreground);
  line-height: 1.3;
  min-width: 0;
}
.type-measures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 14px 18px 20px;
}
.measure-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.measure-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-foreground-secondary);
}
.radius-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.radius-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.radius-box {
  width: 38px;
  height: 38px;
  background: color-mix(in srgb, var(--color-primary) 16%, var(--color-surface));
  border: 1.5px solid var(--color-primary);
}
.radius-label {
  font-size: 9.5px;
}
.space-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.space-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.space-bar {
  height: 12px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-amber));
  flex-shrink: 0;
}
.space-label {
  font-size: 9.5px;
}
.elev-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.elev-card {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
}
.elev-label {
  font-size: 9.5px;
}

@media (max-width: 860px) {
  .type-specimens {
    grid-template-columns: minmax(0, 1fr);
  }
  .specimen-panel {
    border-right: none;
    border-bottom: 1px solid var(--color-divider);
  }
  .specimen-panel:last-child {
    border-bottom: none;
  }
  .type-measures {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
}
@media (max-width: 560px) {
  .scale-row {
    flex-direction: column;
    gap: 4px;
  }
  .scale-tag {
    width: auto;
  }
  .type-input {
    width: 100%;
  }
  .type-input input {
    width: 100%;
  }
}
</style>
