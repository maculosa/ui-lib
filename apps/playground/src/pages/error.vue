<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import IconLogo from '~icons/bm-icon/vue';

const router = useRouter()

onMounted(() => {
  initParticles()
})

function initParticles() {
  const canvas = document.getElementById('error-particles') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  const particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number }> =
    []

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    })
  }

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(234, 67, 53, 0.5)'

    particles.forEach(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    requestAnimationFrame(animate)
  }

  animate()
}
</script>

<template>
  <div class="error-page">
    <canvas id="error-particles" class="particles"></canvas>
    <div class="content">
      <div class="logo-container">
        <!-- <IconLogo class="main-logo" /> -->
      </div>
      <h1 class="error-code">Error</h1>
      <p class="error-message">系统发生错误</p>
      <div class="cta-buttons">
        <button class="btn primary" @click="router.push('/')">返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  overflow: hidden;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  color: #fff;
}

.logo-container {
  margin-bottom: 2rem;
}

.main-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 10px rgba(234, 67, 53, 0.5));
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ea4335, #fbbc05, #34a853, #4285f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(234, 67, 53, 0.3);
}

.error-message {
  font-size: 1.5rem;
  color: #b3b3b3;
  margin: 1rem 0 3rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: #ea4335;
  color: #fff;
  border: none;
}

.btn.primary:hover {
  background: #ef5350;
  box-shadow: 0 0 20px rgba(234, 67, 53, 0.4);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-message {
    font-size: 1.2rem;
  }
}
</style>
