<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-rotate" />
      同步状态
    </h3>
    <div class="sync-list">
      <div v-for="s in ws.sync" :key="s.id" class="sync-item">
        <span class="sync-dot" :class="s.status" />
        <span class="sync-name">{{ s.name }}</span>
        <span class="sync-time">{{ timeAgo(s.lastSync) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWorkspace } from '@/stores/useWorkspace'
import { timeAgo } from '@/utils/time'

const ws = useWorkspace()
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.sync-list { display: flex; flex-direction: column; gap: 8px; }
.sync-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--t2);
}
.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--t3);
}
.sync-dot.ok { background: #4ade80; }
.sync-dot.pending { background: #f5a623; }
.sync-dot.error { background: #f0537a; }
.sync-name { flex: 1; color: var(--t1); font-weight: 600; }
.sync-time {
  color: var(--t3);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
</style>
