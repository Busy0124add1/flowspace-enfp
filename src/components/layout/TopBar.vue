<template>
  <header class="topbar">
    <div class="brand">
      <i class="fa-solid fa-compass"></i>
      <span>FlowSpace</span>
    </div>
    <MbtiSwitcher />
    <nav class="tabs">
      <RouterLink to="/" class="tab">
        <i class="fa-solid fa-grid-2"></i>
        <span>工作台</span>
      </RouterLink>
      <RouterLink to="/inbox" class="tab">
        <i class="fa-solid fa-inbox"></i>
        <span>收件箱</span>
      </RouterLink>
    </nav>
    <div class="spacer" />
    <div class="clock">{{ clock }}</div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import MbtiSwitcher from '@/components/mbti/MbtiSwitcher.vue'

const clock = ref('')
let timer = null

function tick() {
  const d = new Date()
  clock.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 30 * 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  background: var(--surf);
  border-bottom: 1px solid var(--line);
  height: 52px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: -0.3px;
  color: var(--accent);
}
.brand i { font-size: 16px; }
.tabs {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--r);
  color: var(--t2);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}
.tab:hover { color: var(--t1); background: color-mix(in srgb, var(--accent) 6%, transparent); }
.tab.router-link-active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}
.spacer { flex: 1; }
.clock {
  font-variant-numeric: tabular-nums;
  color: var(--t2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
