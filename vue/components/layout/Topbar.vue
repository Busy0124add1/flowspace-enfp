<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import MbtiSwitcher from '@/components/mbti/MbtiSwitcher.vue'
import PageTabs from '@/components/tabs/PageTabs.vue'

const appStore = useAppStore()

// Clock display
const currentTime = ref('')
let clockInterval = null

function updateClock() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

// Streak badge (mock data for now)
const streakCount = ref(7)
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <div class="logo">
        <span class="logo-dot"></span>
        <span class="logo-text">FlowSpace</span>
      </div>
      <MbtiSwitcher />
    </div>

    <div class="topbar-center">
      <PageTabs />
    </div>

    <div class="topbar-right">
      <div class="streak-badge" v-if="streakCount > 0">
        <i class="fa-solid fa-fire"></i>
        <span>{{ streakCount }}</span>
      </div>
      <div class="clock">{{ currentTime }}</div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
  background: var(--surf);
  border-bottom: 1px solid var(--line);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--t1);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

/* Streak badge */
.streak-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--card);
  border-radius: var(--r);
  font-size: 14px;
  font-weight: 500;
  color: var(--amber);
}

.streak-badge i {
  font-size: 12px;
}

/* Clock */
.clock {
  font-size: 14px;
  font-weight: 500;
  color: var(--t2);
  font-variant-numeric: tabular-nums;
}
</style>