<script setup>
// Sidebar component - right panel with 360px width
// Placeholder content for now
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <div class="sidebar-placeholder">
        <i class="fa-solid fa-grip-lines"></i>
        <span>Sidebar</span>
      </div>
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
}

.sidebar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--t3);
  font-size: 14px;
}

.sidebar-placeholder i {
  font-size: 24px;
}
</style>