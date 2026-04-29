<script setup>
import EnergyPanel from '@/components/dashboard/EnergyPanel.vue'
import ThreadsPanel from '@/components/dashboard/ThreadsPanel.vue'
import DesignFlowPanel from '@/components/dashboard/DesignFlowPanel.vue'
</script>

<template>
  <div class="dashboard-view">
    <div class="s-label"><i class="fa-solid fa-bolt"></i> 今日状态</div>
    <EnergyPanel />
    <div class="spacer"></div>
    <ThreadsPanel />
    <div class="spacer"></div>
    <div class="s-label"><i class="fa-solid fa-diagram-project"></i> 设计流程</div>
    <DesignFlowPanel />
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.s-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--t3);
}
.spacer { height: 4px; }
</style>
