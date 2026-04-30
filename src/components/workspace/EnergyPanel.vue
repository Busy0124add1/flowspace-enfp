<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-bolt" />
      今日状态
    </h3>
    <div class="slider-row" v-for="k in keys" :key="k.key">
      <div class="slider-head">
        <span class="slider-label">{{ k.label }}</span>
        <span class="slider-value">{{ ws.energy[k.key] }}</span>
      </div>
      <Slider
        :model-value="ws.energy[k.key]"
        :min="0" :max="100"
        class="energy-slider"
        :pt="sliderPt(k.key)"
        @update:model-value="(v) => ws.updateEnergy(k.key, v)"
      />
    </div>
  </section>
</template>

<script setup>
import Slider from 'primevue/slider'
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()

const keys = [
  { key: 'mood', label: '情绪' },
  { key: 'focus', label: '专注' },
  { key: 'creative', label: '创意' },
]

function sliderPt(key) {
  return {
    root: `slider-root slider-${key}`,
    handle: 'slider-handle',
    range: 'slider-range',
  }
}
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
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.slider-row { margin-bottom: 14px; }
.slider-row:last-child { margin-bottom: 0; }

.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}
.slider-label {
  font-size: 12px;
  color: var(--t1);
}
.slider-value {
  font-size: 13px;
  font-weight: 800;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
</style>

<style>
/* PrimeVue Slider unstyled 的 pt class，用全局 style（scoped 下无效） */
.slider-root {
  position: relative;
  height: 6px;
  background: var(--line);
  border-radius: 99px;
  cursor: pointer;
}
.slider-range {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
}
.slider-handle {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: var(--t1);
  border: 2px solid var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.15s;
}
.slider-handle:hover { transform: translate(-50%, -50%) scale(1.15); }
.slider-handle:active { cursor: grabbing; }
</style>
