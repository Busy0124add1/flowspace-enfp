<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEnergyStore } from '@/stores/energy'

const app = useAppStore()
const energy = useEnergyStore()

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return app.mbtiConfig.greeting?.morning || '早上好'
  if (hour < 18) return app.mbtiConfig.greeting?.afternoon || '下午好'
  return app.mbtiConfig.greeting?.evening || '晚上好'
})

const vitals = [
  { key: 'mood', label: '情绪', icon: 'fa-heart', color: 'var(--pink)' },
  { key: 'focus', label: '专注', icon: 'fa-bullseye', color: 'var(--cyan)' },
  { key: 'creative', label: '创意', icon: 'fa-wand-magic-sparkles', color: 'var(--violet)' }
]

function updateEnergy(key, e) {
  energy.updateEnergy(key, parseInt(e.target.value))
}
</script>

<template>
  <div class="energy-wrap">
    <div class="energy-top">
      <div class="greeting-block">
        <div class="greeting-text">{{ greeting }}</div>
        <div class="greeting-sub">{{ app.mbtiConfig.description }}</div>
      </div>
      <div class="vitals-row">
        <div v-for="v in vitals" :key="v.key" class="vital-chip">
          <i :class="['fa-solid', v.icon]" :style="{ color: v.color }"></i>
          <input
            type="range"
            min="0"
            max="100"
            :value="energy[v.key]"
            @input="updateEnergy(v.key, $event)"
            class="vital-slider"
          />
          <span class="vital-num">{{ energy[v.key] }}</span>
          <span class="vital-label">{{ v.label }}</span>
        </div>
      </div>
    </div>
    <div class="journal-divider"></div>
    <div class="journal-label">
      <span><i class="fa-solid fa-pen" style="opacity:.5;margin-right:5px;"></i>今日随笔</span>
      <span class="journal-save-hint">Ctrl+↵ 保存</span>
    </div>
    <textarea
      class="journal-ta"
      v-model="energy.journal"
      placeholder="写下今天的感受、想法、或者任何一闪而过的念头…"
      maxlength="500"
      @keydown.ctrl.enter="energy.saveJournal()"
    ></textarea>
  </div>
</template>

<style scoped>
.energy-wrap {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px 20px;
}
.energy-top {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}
.greeting-block { flex: 1; }
.greeting-text {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -.3px;
  color: var(--t1);
}
.greeting-sub {
  font-size: 12px;
  color: var(--t3);
  margin-top: 3px;
}
.vitals-row {
  display: flex;
  gap: 8px;
}
.vital-chip {
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 64px;
  transition: border-color .2s;
}
.vital-chip:hover { border-color: var(--t3); }
.vital-num {
  font-size: 20px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--t1);
}
.vital-label {
  font-size: 10px;
  color: var(--t3);
  font-weight: 600;
  letter-spacing: .6px;
}
.vital-slider {
  width: 100%;
  accent-color: var(--accent);
  cursor: pointer;
}
.journal-divider {
  height: 1px;
  background: var(--line);
  margin-bottom: 12px;
}
.journal-label {
  font-size: 10px;
  color: var(--t3);
  margin-bottom: 6px;
  font-weight: 600;
  letter-spacing: .8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.journal-save-hint {
  font-size: 9px;
  color: var(--t3);
  font-weight: 400;
  letter-spacing: .3px;
}
.journal-ta {
  width: 100%;
  min-height: 54px;
  max-height: 110px;
  background: transparent;
  border: none;
  resize: none;
  font: 400 13px/1.7 "Outfit", sans-serif;
  color: var(--t2);
  outline: none;
  overflow-y: auto;
}
.journal-ta::placeholder { color: var(--t3); }
.journal-ta:focus { color: var(--t1); }
</style>
