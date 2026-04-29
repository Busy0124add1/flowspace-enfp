<script setup>
import SyncStatus from '@/components/common/SyncStatus.vue'
import SparkLine from '@/components/common/SparkLine.vue'
import QuadrantTodo from '@/components/todo/QuadrantTodo.vue'
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <SparkLine />
      <SyncStatus />
      <div class="section-label">四象限待办</div>
      <QuadrantTodo />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 360px;
  min-width: 360px;
  height: 100%;
  background: var(--surf);
  border-left: 1px solid var(--line);
  overflow-y: auto;
}

.sidebar-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--t3);
  margin-top: 4px;
}
</style>