<route lang="yaml">
  meta:
    layout: home
</route>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDark } from '@vueuse/core';
// import IconLogo from '~icons/bm-icon/vue';
import IconCopy from '~icons/bm-icon/copy';
import IconCode from '~icons/bm-icon/copy';
import IconBook from '~icons/bm-icon/copy';

const isDark = useDark();

onMounted(() => {
  initParticles();
});

function initParticles() {
  const canvas = document.getElementById('particles') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; color: string }> = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // 根据主题设置粒子颜色
  const getParticleColor = () => {
    return isDark.value ? 'rgba(66, 133, 244, 0.5)' : 'rgba(66, 133, 244, 0.3)';
  };

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      color: getParticleColor()
    });
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
</script>

<template>
  <div class="hero">
    <canvas id="particles" class="particles"></canvas>
    <div class="content">
      <div class="logo-container">
        <!-- <IconLogo class="main-logo" /> -->
        <h1 class="title">Banmao UI</h1>
      </div>
      <p class="subtitle">配置化 Vue 组件库，快速构建企业级应用</p>
      
      <!-- CTA 按钮 -->
      <div class="cta-buttons">
        <a href="/procomponent" class="btn primary">
          <IconCode class="btn-icon" /> 开始使用
        </a>
        <a href="/docs/overview" class="btn secondary">
          <IconBook class="btn-icon" /> 查看文档
        </a>
      </div>
      
      <!-- 核心特性 -->
      <div class="grid grid-cols-3 gap-10 max-lg:grid-cols-1">
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <IconCopy class="feature-icon" />
          </div>
          <h3>高性能</h3>
          <p>基于 Vue 3 + TypeScript 构建，提供卓越的性能体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <IconCopy class="feature-icon" />
          </div>
          <h3>可定制</h3>
          <p>丰富的主题配置选项，打造专属的设计系统</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <IconCopy class="feature-icon" />
          </div>
          <h3>企业级</h3>
          <p>大量实践沉淀，满足企业级应用的复杂需求</p>
        </div>

      <!-- 产品系列 -->
        <div class="product-section">
          <div class="product-header">
            <h2 class="section-title">ProComponent</h2>
            <p class="section-desc">企业级中后台解决方案</p>
          </div>
          <div class="section-features">
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>高性能表格</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>灵活布局</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>丰富组件</span>
            </div>
          </div>
          <a href="/procomponent/" class="section-link">
            立即使用
            <span class="link-arrow">→</span>
          </a>
        </div>
        <div class="product-section">
          <div class="product-header">
            <h2 class="section-title">Data V</h2>
            <p class="section-desc">数据可视化解决方案</p>
          </div>
          <div class="section-features">
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>图表组件</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>动态效果</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>主题定制</span>
            </div>
          </div>
          <a href="/datav/" class="section-link">
            立即使用
            <span class="link-arrow">→</span>
          </a>
        </div>
        <div class="product-section">
          <div class="product-header">
            <h2 class="section-title">Blocks</h2>
            <p class="section-desc">开箱即用的 UI 区块</p>
          </div>
          <div class="section-features">
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>登录表单</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>注册页面</span>
            </div>
            <div class="section-feature">
              <IconCopy class="section-feature-icon" />
              <span>仪表盘</span>
            </div>
          </div>
          <a href="/blocks/" class="section-link">
            立即使用
            <span class="link-arrow">→</span>
          </a>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="footer-info">
        <p class="footer-text">
          <span class="highlight">Banmao UI</span> 是一个基于 Vue 3 的配置化组件库，专为企业级应用设计
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - var(--layout-header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  overflow: hidden;
  padding: 2rem 0;
}

.dark .hero {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
}

.dark .content {
  color: #fff;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.main-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 10px rgba(66, 133, 244, 0.5));
}

.title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(66, 133, 244, 0.3);
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: #666;
  margin: 1.5rem 0 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dark .subtitle {
  color: #b3b3b3;
}

/* CTA 按钮 */
.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 3rem 0 5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn.primary {
  background: linear-gradient(45deg, #4285f4, #34a853);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
}

.btn.secondary {
  background: transparent;
  color: #4285f4;
  border: 2px solid #4285f4;
}

.dark .btn.secondary {
  color: #fff;
  border-color: #4285f4;
}

.btn.secondary:hover {
  background: rgba(66, 133, 244, 0.1);
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.2);
  transform: translateY(-2px);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* 核心特性 */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  padding: 0 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .feature-card {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(66, 133, 244, 0.2);
}

.dark .feature-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(66, 133, 244, 0.3);
}

.feature-icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
  border-radius: 12px;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1);
  background: linear-gradient(45deg, rgba(66, 133, 244, 0.2), rgba(52, 168, 83, 0.2));
}

.feature-icon {
  width: 32px;
  height: 32px;
  color: #4285f4;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin: 0 0 1rem;
  color: #333;
  font-weight: 600;
}

.dark .feature-card h3 {
  color: #fff;
}

.feature-card p {
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.dark .feature-card p {
  color: #b3b3b3;
}

/* 产品系列 */
.product-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 5rem 0;
  padding: 0 2rem;
}

.product-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4285f4, #34a853);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.product-section:hover::before {
  transform: scaleX(1);
}

.dark .product-section {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.product-section:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(66, 133, 244, 0.2);
}

.dark .product-section:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(66, 133, 244, 0.3);
}

.product-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  margin: 0 0 0.75rem;
  background: linear-gradient(45deg, #4285f4, #34a853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.section-desc {
  color: #666;
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.dark .section-desc {
  color: #b3b3b3;
}

.section-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.section-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
}

.dark .section-feature {
  color: #e0e0e0;
}

.section-feature-icon {
  width: 18px;
  height: 18px;
  color: #4285f4;
  flex-shrink: 0;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(45deg, #4285f4, #34a853);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  box-shadow: 0 2px 10px rgba(66, 133, 244, 0.2);
}

.section-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
}

.link-arrow {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.section-link:hover .link-arrow {
  transform: translateX(3px);
}

/* 底部信息 */
.footer-info {
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: #666;
}

.dark .footer-info {
  border-top-color: rgba(255, 255, 255, 0.1);
  color: #b3b3b3;
}

.footer-text {
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.highlight {
  color: #4285f4;
  font-weight: 600;
}

.dark .highlight {
  color: #4285f4;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .features {
    padding: 0 1rem;
    margin: 3rem 0;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .product-sections {
    padding: 0 1rem;
    margin: 3rem 0;
    gap: 1.5rem;
  }
  
  .product-section {
    padding: 2rem 1.5rem;
  }
  
  .section-features {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .footer-info {
    margin-top: 3rem;
    padding: 1.5rem 1rem 0;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
    margin: 1rem 0 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .product-sections {
    grid-template-columns: 1fr;
  }
}
</style>