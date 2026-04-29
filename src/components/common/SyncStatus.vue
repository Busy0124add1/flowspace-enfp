<script setup>
import { ref } from 'vue'

const services = ref([
  { id: 'obsidian', name: 'Obsidian', lastSync: '10 分钟前', progress: 100, status: 'ok' },
  { id: 'github', name: 'GitHub', lastSync: '2 小时前', progress: 100, status: 'ok' },
  { id: 'notion', name: 'Notion', lastSync: '昨天', progress: 45, status: 'warn' },
  { id: 'calendar', name: '日历', lastSync: '同步中...', progress: 30, status: 'idle' },
])

function getStatusColor(status) {
  switch (status) {
    case 'ok': return 'var(--lime)'
    case 'warn': return 'var(--amber)'
    default: return 'var(--t3)'
  }
}

function handleRefresh() {
  services.value = services.value.map(s => ({
    ...s,
    lastSync: '刚刚',
    progress: 100,
    status: 'ok'
  }))
}
</script>

<template>
  <div class="sync-status">
    <div class="sync-header">
      <span class="sync-title">同步状态</span>
      <button class="refresh-btn" @click="handleRefresh">
        <i class="fa-solid fa-rotate-right"></i>
      </button>
    </div>
    <div class="sync-list">
      <div v-for="svc in services" :key="svc.id" class="sync-item">
        <div class="sync-info">
          <span class="sync-dot" :style="{ background: getStatusColor(svc.status) }"></span>
          <span class="sync-name">{{ svc.name }}</span>
        </div>
        <div class="sync-meta">
          <span class="sync-time">{{ svc.lastSync }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: svc.progress + '%', background: getStatusColor(svc.status) }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sync-status {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 12px;
}

.sync-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sync-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--t2);
}

.refresh-btn {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  padding: 4px;
  font-size: 11px;
  border-radius: 4px;
  transition: color 0.15s;
}

.refresh-btn:hover {
  color: var(--accent);
}

.sync-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sync-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sync-name {
  font-size: 11px;
  color: var(--t1);
}

.sync-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
}

.sync-time {
  font-size: 10px;
  color: var(--t3);
  min-width: 50px;
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: var(--line);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}
</style>