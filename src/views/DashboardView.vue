<template>
  <div class="dashboard">
    <!-- 顶部横幅：DailySpark 跨整行 -->
    <div class="banner-slot">
      <DailySpark />
    </div>
    <!-- 双列主体 -->
    <div class="two-col">
      <section class="left">
        <EnergyPanel />
        <JournalPanel />
        <ThreadsPanel />
        <DesignFlowPanel />
      </section>
      <RightSidebar>
        <MascotAvatar />
        <QuadrantTodo />
        <FlashNotes />
        <SyncStatus />
      </RightSidebar>
    </div>
  </div>
</template>

<script setup>
import RightSidebar from '@/components/layout/RightSidebar.vue'
import DailySpark from '@/components/workspace/DailySpark.vue'
import EnergyPanel from '@/components/workspace/EnergyPanel.vue'
import JournalPanel from '@/components/workspace/JournalPanel.vue'
import ThreadsPanel from '@/components/workspace/ThreadsPanel.vue'
import DesignFlowPanel from '@/components/workspace/DesignFlowPanel.vue'
import MascotAvatar from '@/components/workspace/MascotAvatar.vue'
import QuadrantTodo from '@/components/workspace/QuadrantTodo.vue'
import FlashNotes from '@/components/workspace/FlashNotes.vue'
import SyncStatus from '@/components/workspace/SyncStatus.vue'
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
</style>
