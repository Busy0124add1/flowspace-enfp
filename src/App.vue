<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  // Apply CSS variables on mount
  appStore.applyCssVars()
})
</script>

<template>
  <div id="app">
    <h1>FlowSpace ENFP</h1>
    <p>Current MBTI: <strong>{{ appStore.currentMbti }}</strong></p>
    <p>Accent Color: <span :style="{ color: appStore.accentColor }">{{ appStore.accentColor }}</span></p>
    <p>Description: {{ appStore.mbtiConfig.description }}</p>

    <!-- Style verification test - should show pink accent color -->
    <div class="style-test">
      <div class="test-bg">BG</div>
      <div class="test-surface">SURF</div>
      <div class="test-card">CARD</div>
      <div class="test-accent">ACCENT</div>
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  padding: 20px;
}

.style-test {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.style-test > div {
  width: 60px;
  height: 60px;
  border-radius: var(--r);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.test-bg {
  background: var(--bg);
  color: var(--t1);
  border: 1px solid var(--line);
}

.test-surface {
  background: var(--surf);
  color: var(--t1);
}

.test-card {
  background: var(--card);
  color: var(--t1);
}

.test-accent {
  background: var(--accent);
  color: #fff;
}
</style>
