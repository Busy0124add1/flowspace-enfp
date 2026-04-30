<template>
  <div class="dashboard">
    <!-- 顶部横幅（DailySpark 占位，Task 22 填） -->
    <div class="banner-slot">
      <!-- DailySpark 将在 Task 22 插入这里 -->
    </div>
    <!-- 双列主体 -->
    <div class="two-col">
      <section class="left">
        <!-- EnergyPanel / JournalPanel / ThreadsPanel / DesignFlowPanel 将在后续 Task 插入 -->
        <div class="placeholder">左列（工作台模块待填充）</div>
      </section>
      <RightSidebar>
        <!-- QuadrantTodo / FlashNotes / SyncStatus / MascotAvatar 将在后续 Task 插入 -->
        <div class="placeholder">右列（侧边栏模块待填充）</div>
      </RightSidebar>
    </div>
  </div>
</template>

<script setup>
import RightSidebar from '@/components/layout/RightSidebar.vue'
</script>

<style scoped>
.dashboard {
  height: calc(100vh - 52px);
  display: grid;
  grid-template-rows: auto 1fr;
}
.banner-slot {
  padding: 0 20px;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 360px;
  overflow: hidden;
}
.left {
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.placeholder {
  color: var(--t3);
  padding: 40px 16px;
  text-align: center;
  font-size: 13px;
  border: 1px dashed var(--line);
  border-radius: var(--r2);
}
</style>
