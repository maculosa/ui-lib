<route lang="yaml">
  meta:
    layout: home
</route>

<script setup lang="ts">
import { onMounted } from 'vue';
// import IconLogo from '~icons/bm-icon/vue';
import IconCopy from '~icons/bm-icon/copy';

onMounted(() => {
  initParticles();
});

function initParticles() {
  const canvas = document.getElementById('particles') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number }> = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2
    });
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(66, 133, 244, 0.5)';

    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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
      <p class="subtitle">下一代高性能 Vue 组件库</p>
      <div class="features">
        <div class="feature-card">
          <IconCopy class="feature-icon" />
          <h3>高性能</h3>
          <p>基于 Vue 3 + TypeScript 构建，提供卓越的性能体验</p>
        </div>
        <div class="feature-card">
          <IconCopy class="feature-icon" />
          <h3>可定制</h3>
          <p>丰富的主题配置选项，打造专属的设计系统</p>
        </div>
        <div class="feature-card">
          <IconCopy class="feature-icon" />
          <h3>企业级</h3>
          <p>大量实践沉淀，满足企业级应用的复杂需求</p>
        </div>
      </div>

      <div class="product-sections">
        <div class="product-section">
          <h2 class="section-title">ProComponent</h2>
          <p class="section-desc">企业级中后台解决方案</p>
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
          <a href="/procomponent/" class="section-link">立即使用</a>
        </div>
        <div class="product-section">
          <h2 class="section-title">Data V</h2>
          <p class="section-desc">数据可视化解决方案</p>
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
          <a href="/datav/" class="section-link">立即使用</a>
        </div>
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
  /* background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%); */
  overflow: hidden;
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

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 4rem auto;
  padding: 0 1rem;
  max-width: 1200px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(66, 133, 244, 0.3);
}

.subtitle {
  font-size: 1.5rem;
  color: #b3b3b3;
  margin: 1rem 0 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  padding: 0 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  color: #4285f4;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #fff;
}

.feature-card p {
  color: #b3b3b3;
  margin: 0;
  line-height: 1.5;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn.primary {
  background: #4285f4;
  color: #fff;
  border: none;
}

.btn.primary:hover {
  background: #5a95f5;
  box-shadow: 0 0 20px rgba(66, 133, 244, 0.4);
}

.btn.secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #4285f4;
}

.btn.secondary:hover {
  background: rgba(66, 133, 244, 0.1);
  box-shadow: 0 0 20px rgba(66, 133, 244, 0.2);
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }
}

.product-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem auto;
  padding: 0 2rem;
  max-width: 1200px;
}

.product-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.product-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: rgba(66, 133, 244, 0.3);
}

.section-title {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 0.5rem;
  background: linear-gradient(45deg, #4285f4, #34a853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-desc {
  color: #b3b3b3;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.section-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.section-feature-icon {
  width: 20px;
  height: 20px;
  color: #4285f4;
}

.section-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(45deg, #4285f4, #34a853);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.section-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 133, 244, 0.3);
}

@media (max-width: 768px) {
  .product-sections {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-desc {
    font-size: 1rem;
  }
}
</style>