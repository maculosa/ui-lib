<route lang="yaml">
meta:
  layout: home
</route>

<script setup lang="tsx">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { NButton, NInput, NTag, useMessage } from 'naive-ui'
import { ProTable } from '@banmao/procomponent'
import { Chart } from '@banmao/datav'
import LiveSpecimen from '@/components/home/LiveSpecimen.vue'
import ScriptTabs from '@/components/ScriptTabs/index.vue'
import CodePreview from '@/components/CodePreview/index.vue'
import Logo from '@/components/layout/logo/index.vue'

const message = useMessage()

const stats = [
  { value: '19+', label: 'Pro 组件' },
  { value: '5', label: '图表组件' },
  { value: '100%', label: 'TypeScript' },
  { value: 'MIT', label: '开源协议' },
]

const marqueeItems = [
  'ProTable', 'ProForm', 'ProLayout', 'ProDescriptions', 'ProText', 'ProList',
  'Watermark', 'Tour', 'ModalForm', 'DrawerForm', 'QueryFilter', 'LiteFilter',
  'LoginForm', 'ProTabs', 'TextClamp', 'Chart', 'Pie', 'Pie3D', 'CircleBar',
  'CubeBar', 'Login Blocks',
]

const previewColumns = [
  { title: '组件', key: 'name', width: 150 },
  { title: '分类', key: 'category', width: 110 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row: any) {
      return (
        <NTag size="small" type={row.status === 'ready' ? 'success' : 'warning'} bordered={false}>
          {row.status === 'ready' ? '就绪' : '迭代中'}
        </NTag>
      )
    },
  },
  { title: '版本', key: 'version', width: 90 },
]

const previewData = [
  { name: 'ProTable', category: '数据展示', status: 'ready', version: 'v0.7' },
  { name: 'ProForm', category: '数据录入', status: 'ready', version: 'v0.7' },
  { name: 'ProLayout', category: '布局', status: 'ready', version: 'v0.6' },
  { name: 'ProDescriptions', category: '数据展示', status: 'ready', version: 'v0.5' },
  { name: 'ProText', category: '数据展示', status: 'beta', version: 'v0.4' },
]

const previewPagination = {
  page: 1,
  pageSize: 5,
  itemCount: 5,
  showSizePicker: false,
  showQuickJumper: false,
}

const chartData = [
  { name: 'Mon', value: 1548, phone: 234 },
  { name: 'Tue', value: 2125, phone: 345 },
  { name: 'Wed', value: 1520, phone: 124 },
  { name: 'Thu', value: 3498, phone: 423 },
  { name: 'Fri', value: 3200, phone: 389 },
  { name: 'Sat', value: 3181, phone: 460 },
  { name: 'Sun', value: 2789, phone: 310 },
]

const loginModel = ref({ username: '', password: '' })
const loginLoading = ref(false)

function handleDemoLogin() {
  loginLoading.value = true
  setTimeout(() => {
    loginLoading.value = false
    message.success('登录成功（演示交互，未发送真实请求）')
  }, 600)
}

const features = [
  {
    index: '01',
    title: '配置化驱动',
    desc: '用一份 JSON 描述界面，而非堆砌模板。列配置即搜索表单、即数据表格、即编辑表单，CRUD 页面开箱即用。',
    tags: ['Schema First', 'CRUD'],
  },
  {
    index: '02',
    title: '完整类型推导',
    desc: '全量 TypeScript 编写，配置项、渲染函数与回调参数均有类型提示，大型项目重构安心。',
    tags: ['TypeScript', 'DX'],
  },
  {
    index: '03',
    title: '令牌级主题系统',
    desc: '继承 Naive UI 的主题能力，从主色到圆角皆可定制，明暗双主题一键切换，设计语言全站统一。',
    tags: ['Design Tokens', 'Dark Mode'],
  },
  {
    index: '04',
    title: '企业级实践沉淀',
    desc: '来自真实中后台项目：列设置持久化、批量操作、自适应高度、远程搜索，复杂场景已被验证。',
    tags: ['Battle-tested', 'Enterprise'],
  },
]

const quickStartCode = `<template>
  <ProTable
    :columns="columns"
    :data="dataSource"
    :search="true"
    @query="handleQuery"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const dataSource = ref([])
const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', valueType: 'digit' },
  { title: '城市', key: 'city', valueType: 'select',
    options: [{ label: '杭州', value: 'hz' }] },
]

async function handleQuery(params) {
  dataSource.value = await api.list(params)
}
<\/script>`

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.bm-reveal').forEach(el => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="bm-mono-label hero-kicker">
            <i class="hero-dot bm-blink" aria-hidden="true"></i>
            VUE 3 · CONFIG-DRIVEN · ENTERPRISE READY
          </p>
          <h1 class="hero-title">
            配置即界面，<br />
            <span>组件即手艺。</span>
          </h1>
          <p class="hero-sub">
            Banmao UI 是一套基于 Naive UI 的配置化组件库。用一份配置描述表格、表单与布局，
            把中后台开发从重复劳动中解放出来。
          </p>
          <div class="hero-cta">
            <RouterLink to="/procomponent" class="btn-primary">
              开始使用
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </RouterLink>
            <RouterLink to="/docs/zh" class="btn-ghost">查看文档</RouterLink>
          </div>
          <dl class="hero-stats">
            <div v-for="s in stats" :key="s.label" class="hero-stat">
              <dt>{{ s.value }}</dt>
              <dd>{{ s.label }}</dd>
            </div>
          </dl>
        </div>

        <div id="specimen" class="hero-specimen bm-reveal" style="scroll-margin-top: 84px">
          <LiveSpecimen />
          <p class="hero-specimen-note bm-mono-label">FIG.00 — 拖动控件，实时重塑真实组件</p>
        </div>
      </div>
    </section>

    <!-- ============ MARQUEE ============ -->
    <div class="marquee bm-marquee" aria-hidden="true">
      <div class="marquee-track bm-marquee-track">
        <span v-for="(item, i) in [...marqueeItems, ...marqueeItems]" :key="i" class="marquee-item">
          {{ item }}<i class="marquee-star">✦</i>
        </span>
      </div>
    </div>

    <!-- ============ PRODUCTS ============ -->
    <section class="section products">
      <header class="section-head bm-reveal">
        <p class="bm-mono-label">FIG.01 — 产品系列</p>
        <h2 class="section-title">三个工坊，一套系统</h2>
        <p class="section-desc">组件、图表与页面区块共享同一套设计令牌，拼在一起即是完整的中后台。</p>
      </header>

      <!-- ProComponent -->
      <article class="product-panel product-panel-wide bm-reveal bm-corner-marks">
        <div class="product-copy">
          <span class="product-index bm-mono-label">01 / PRO</span>
          <h3 class="product-name">ProComponent</h3>
          <p class="product-desc">
            企业级中后台解决方案。一份列配置驱动搜索、表格、表单与工具栏，
            右侧即是运行中的真实 ProTable。
          </p>
          <ul class="product-chips">
            <li>ProTable</li>
            <li>ProForm</li>
            <li>ProLayout</li>
            <li>ProDescriptions</li>
          </ul>
          <RouterLink to="/procomponent" class="product-link">
            浏览组件
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </RouterLink>
        </div>
        <div class="product-demo product-table">
          <ProTable
            title="组件清单"
            :columns="previewColumns"
            :data="previewData"
            :pagination="previewPagination"
            :search="false"
            :toolbar="{ create: false, delete: false, export: false, print: false }"
            :row-key="(row: any) => row.name"
            column-storage-key="home-preview-table"
            :scroll-x="560"
          />
        </div>
      </article>

      <div class="product-grid">
        <!-- Data V -->
        <article class="product-panel bm-reveal bm-corner-marks">
          <div class="product-copy">
            <span class="product-index bm-mono-label">02 / DATAV</span>
            <h3 class="product-name">Data V</h3>
            <p class="product-desc">
              基于 ECharts 的声明式图表：渐变柱状、折线、3D 环形与立方柱，传入数据即出图。
            </p>
            <ul class="product-chips">
              <li>Chart</li>
              <li>Pie</li>
              <li>Pie3D</li>
              <li>CubeBar</li>
            </ul>
            <RouterLink to="/datav" class="product-link">
              进入图表工坊
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </RouterLink>
          </div>
          <div class="product-demo">
            <div class="chart-paper">
              <Chart
                :title="{ text: '本周销售趋势', left: 12, top: 8, textStyle: { fontSize: 13, color: '#1c1a15', fontWeight: 600 } }"
                :legend="{ mapData: { value: '销售额', phone: '访问量' }, top: 8, right: 12 }"
                trigger-type="axis"
                :bar-width="14"
                :x-axis="{ type: 'category' }"
                :y-axis="{ type: 'value' }"
                :series-type="[
                  { type: 'bar', color: ['#f04e23', '#e8a013'] },
                  { type: 'line', color: '#2f6bff' },
                ]"
                :data="chartData"
              />
            </div>
          </div>
        </article>

        <!-- Blocks -->
        <article class="product-panel bm-reveal bm-corner-marks">
          <div class="product-copy">
            <span class="product-index bm-mono-label">03 / BLOCKS</span>
            <h3 class="product-name">Blocks</h3>
            <p class="product-desc">
              开箱即用的页面区块：登录、注册、仪表盘。下方登录表单可以直接交互，复制即可落地。
            </p>
            <ul class="product-chips">
              <li>Login</li>
              <li>Register</li>
              <li>Dashboard</li>
            </ul>
            <RouterLink to="/blocks" class="product-link">
              查看区块
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </RouterLink>
          </div>
          <div class="product-demo">
            <div class="login-preview bm-dot-grid">
              <div class="login-card">
                <p class="bm-mono-label login-card-label">LOGIN BLOCK · 交互预览</p>
                <h4 class="login-card-title">欢迎回来</h4>
                <NInput v-model:value="loginModel.username" placeholder="用户名" size="large">
                  <template #prefix>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                      <circle cx="12" cy="8" r="3.6" />
                      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
                    </svg>
                  </template>
                </NInput>
                <NInput
                  v-model:value="loginModel.password"
                  type="password"
                  show-password-on="click"
                  placeholder="密码"
                  size="large"
                >
                  <template #prefix>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
                      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                    </svg>
                  </template>
                </NInput>
                <NButton type="primary" block size="large" :loading="loginLoading" @click="handleDemoLogin">
                  登 录
                </NButton>
                <p class="login-card-foot">
                  <span>忘记密码？</span>
                  <span>注册账号 →</span>
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ============ FEATURES ============ -->
    <section class="section features">
      <header class="section-head bm-reveal">
        <p class="bm-mono-label">FIG.02 — 为什么选择 BANMAO</p>
        <h2 class="section-title">为长期维护而设计</h2>
      </header>
      <div class="feature-list">
        <article v-for="(f, i) in features" :key="f.index" class="feature-row bm-reveal" :style="{ transitionDelay: `${i * 0.06}s` }">
          <span class="feature-index">{{ f.index }}</span>
          <div class="feature-body">
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
          <ul class="feature-tags">
            <li v-for="t in f.tags" :key="t">{{ t }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ============ INSTALL ============ -->
    <section class="section install">
      <div class="install-inner bm-reveal bm-corner-marks">
        <div class="install-copy">
          <p class="bm-mono-label">FIG.03 — 快速开始</p>
          <h2 class="section-title">三十秒，开始构建</h2>
          <p class="section-desc">
            安装 ProComponent，引入组件与样式，剩下的交给配置。完整指南见文档。
          </p>
          <ScriptTabs pkg="@banmao/procomponent" />
          <RouterLink to="/procomponent/overview" class="product-link install-link">
            阅读完整指南
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </RouterLink>
        </div>
        <div class="install-code">
          <CodePreview :code="quickStartCode" language="xml" />
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <Logo />
          <p class="footer-tagline">配置即界面，组件即手艺。</p>
        </div>
        <nav class="footer-col" aria-label="产品">
          <p class="bm-mono-label">产品</p>
          <RouterLink to="/procomponent">ProComponent</RouterLink>
          <RouterLink to="/datav">Data V</RouterLink>
          <RouterLink to="/blocks">Blocks</RouterLink>
          <RouterLink to="/ui">UI</RouterLink>
        </nav>
        <nav class="footer-col" aria-label="资源">
          <p class="bm-mono-label">资源</p>
          <RouterLink to="/docs/zh">文档</RouterLink>
          <RouterLink to="/procomponent">组件目录</RouterLink>
          <RouterLink to="/examples">在线示例</RouterLink>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Banmao UI · MIT License</span>
        <span class="bm-mono-label">VUE 3 · NAIVE UI · ECHARTS</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home {
  overflow-x: clip;
}

/* --- HERO --- */
.hero {
  position: relative;
  padding: 72px 24px 56px;
}
.hero-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 56px;
  align-items: center;
}
.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-surface);
}
.hero-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}
.hero-title {
  margin: 26px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(40px, 5.2vw, 64px);
  line-height: 1.14;
  letter-spacing: 0.01em;
  color: var(--color-foreground);
}
.hero-title span {
  color: var(--color-primary);
}
.hero-sub {
  margin: 22px 0 0;
  max-width: 460px;
  font-size: 15.5px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}
.hero-cta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 32%, transparent);
  transition: transform 0.25s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.25s ease, background-color 0.2s ease;
}
.btn-primary svg {
  width: 16px;
  height: 16px;
  transition: transform 0.25s ease;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-primary) 40%, transparent);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}
.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-foreground);
  font-size: 14.5px;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.25s ease;
}
.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 32px;
  margin: 44px 0 0;
  padding-top: 26px;
  border-top: 1px dashed var(--color-divider);
  width: fit-content;
}
.hero-stat dt {
  font-family: var(--font-mono);
  font-size: 24px;
  color: var(--color-foreground);
}
.hero-stat dd {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-foreground-tertiary);
}
.hero-specimen-note {
  margin: 14px 4px 0;
  text-align: right;
}

/* --- MARQUEE --- */
.marquee {
  border-top: 1px solid var(--color-divider);
  border-bottom: 1px solid var(--color-divider);
  background: var(--color-surface);
  overflow: hidden;
  padding: 14px 0;
}
.marquee-track {
  display: flex;
  width: max-content;
  gap: 0;
}
.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  padding-right: 22px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--color-foreground-secondary);
  white-space: nowrap;
}
.marquee-star {
  font-style: normal;
  color: var(--color-primary);
  font-size: 10px;
}

/* --- SECTIONS --- */
.section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 88px 24px 0;
}
.section-head {
  margin-bottom: 40px;
}
.section-title {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.2;
  color: var(--color-foreground);
}
.section-desc {
  margin: 14px 0 0;
  max-width: 560px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--color-foreground-secondary);
}

/* --- PRODUCTS --- */
.product-panel {
  border: 1px solid var(--color-divider);
  border-radius: 16px;
  background: var(--color-surface);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.19, 1, 0.22, 1);
}
.product-panel:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-divider));
  box-shadow: 0 24px 64px var(--color-shadow);
  transform: translateY(-3px);
}
.product-panel-wide {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 40px;
  align-items: center;
  margin-bottom: 24px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.product-index {
  color: var(--color-primary);
}
.product-name {
  margin: 10px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: 30px;
  color: var(--color-foreground);
}
.product-desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-foreground-secondary);
}
.product-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}
.product-chips li {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-divider);
  background: var(--color-background-secondary);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--color-foreground-secondary);
}
.product-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 22px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}
.product-link svg {
  width: 15px;
  height: 15px;
  transition: transform 0.25s ease;
}
.product-link:hover svg {
  transform: translateX(4px);
}
.product-demo {
  min-width: 0;
}
.product-table {
  border: 1px solid var(--color-divider);
  border-radius: 12px;
  padding: 16px;
  background: var(--color-background-secondary);
}
.chart-paper {
  height: 260px;
  border-radius: 12px;
  border: 1px solid #dfdacc;
  background: #fbfaf6;
  padding: 8px;
}
.login-preview {
  border-radius: 12px;
  border: 1px solid var(--color-divider);
  background-color: var(--color-background-secondary);
  padding: 28px 20px;
  display: flex;
  justify-content: center;
}
.login-card {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px 24px;
  border-radius: 14px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  box-shadow: 0 16px 48px var(--color-shadow);
}
.login-card-label {
  color: var(--color-primary);
}
.login-card-title {
  margin: 2px 0 8px;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: 24px;
  color: var(--color-foreground);
}
.login-card :deep(.n-input-prefix) {
  margin-right: 8px;
  color: var(--color-foreground-tertiary);
}
.login-card :deep(.n-input-prefix svg) {
  width: 16px;
  height: 16px;
}
.login-card-foot {
  display: flex;
  justify-content: space-between;
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-foreground-tertiary);
}
.login-card-foot span {
  cursor: pointer;
  transition: color 0.2s ease;
}
.login-card-foot span:hover {
  color: var(--color-primary);
}

/* --- FEATURES --- */
.feature-list {
  border-top: 1px solid var(--color-divider);
}
.feature-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: baseline;
  padding: 30px 8px;
  border-bottom: 1px solid var(--color-divider);
  transition: background-color 0.3s ease, padding-left 0.3s ease;
}
.feature-row:hover {
  background: var(--color-hover);
  padding-left: 18px;
}
.feature-index {
  font-family: var(--font-mono);
  font-size: 15px;
  color: var(--color-primary);
}
.feature-title {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  color: var(--color-foreground);
}
.feature-desc {
  margin: 8px 0 0;
  max-width: 620px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-foreground-secondary);
}
.feature-tags {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.feature-tags li {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-fill);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-foreground-secondary);
  white-space: nowrap;
}

/* --- INSTALL --- */
.install {
  padding-bottom: 96px;
}
.install-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 44px;
  border: 1px solid var(--color-divider);
  border-radius: 18px;
  background: var(--color-surface);
  padding: 44px;
}
.install-copy .section-title {
  font-size: clamp(26px, 2.8vw, 34px);
}
.install-copy :deep(.script-tabs) {
  margin-top: 26px;
}
.install-link {
  margin-top: 20px;
}
.install-code {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--bm-code-divider);
  align-self: start;
}
.install-code :deep(.code-preview) {
  border-top: none;
}
.install-code :deep(.code-preview-body) {
  max-height: 380px;
}

/* --- FOOTER --- */
.footer {
  border-top: 1px solid var(--color-divider);
  background: var(--color-surface);
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 52px 24px 36px;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
}
.footer-tagline {
  margin: 16px 0 0;
  font-family: var(--font-serif);
  font-size: 17px;
  color: var(--color-foreground-secondary);
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-col .bm-mono-label {
  margin-bottom: 6px;
}
.footer-col a {
  font-size: 13.5px;
  color: var(--color-foreground-secondary);
  text-decoration: none;
  width: fit-content;
  transition: color 0.2s ease;
}
.footer-col a:hover {
  color: var(--color-primary);
}
.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px;
  border-top: 1px dashed var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--color-foreground-tertiary);
}

/* --- RESPONSIVE --- */
@media (max-width: 1023px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 44px;
  }
  .hero {
    padding-top: 48px;
  }
  .product-panel-wide {
    grid-template-columns: 1fr;
  }
  .product-grid {
    grid-template-columns: 1fr;
  }
  .install-inner {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }
  .feature-row {
    grid-template-columns: 48px minmax(0, 1fr);
  }
  .feature-tags {
    grid-column: 2;
    margin-top: 12px;
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 640px) {
  .hero-stats {
    grid-template-columns: repeat(2, auto);
    gap: 20px 40px;
  }
  .section {
    padding-top: 64px;
  }
  .product-panel {
    padding: 24px 18px;
  }
  .feature-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .feature-tags {
    grid-column: 1;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
