<script setup>
import { useThreadsStore } from '@/stores/threads'

const threads = useThreadsStore()

function toggleStep(threadIdx, stepIdx) {
  threads.toggleStep(threadIdx, stepIdx)
}
</script>

<template>
  <div class="threads-wrap">
    <div class="s-label"><i class="fa-solid fa-layer-group"></i> 并行任务线</div>
    <div class="threads-grid">
      <div
        v-for="(thread, tIdx) in threads.threads"
        :key="thread.id"
        class="thread"
        :style="{ '--tc': thread.color }"
      >
        <div class="thread-splat-layer">
          <div class="thread-glow" :style="{ background: thread.color }"></div>
        </div>
        <div
          class="thread-paint"
          :style="{
            background: `linear-gradient(135deg, ${thread.color}40, ${thread.color}20)`,
            opacity: thread.pct / 100 * 0.7
          }"
        ></div>
        <div class="thread-head">
          <div class="thread-ico" :style="{ background: thread.color + '22', color: thread.color }">
            <i :class="['fa-solid', thread.icon]"></i>
          </div>
          <div class="thread-pct-big">{{ thread.pct }}%</div>
        </div>
        <div class="thread-name">{{ thread.name }}</div>
        <div class="thread-desc">{{ thread.desc }}</div>
        <div class="thread-bar-track">
          <div
            class="thread-bar-fill"
            :style="{ width: thread.pct + '%', background: thread.color }"
          ></div>
        </div>
        <div class="thread-steps">
          <div
            v-for="(step, sIdx) in thread.steps"
            :key="sIdx"
            class="thread-step"
            :class="{ done: step.d }"
            @click="toggleStep(tIdx, sIdx)"
          >
            <div class="step-check">
              <i v-if="step.d" class="fa-solid fa-check" style="font-size:8px"></i>
            </div>
            <span class="thread-step-text">{{ step.t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.threads-wrap { width: 100%; }
.s-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--t3);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.threads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
}
.thread {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
  cursor: default;
  transition: border-color .3s, box-shadow .3s;
  position: relative;
  overflow: hidden;
}
.thread-splat-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: var(--r2);
  overflow: hidden;
}
.thread-glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: .12;
}
.thread-paint {
  position: absolute;
  inset: 0;
  border-radius: var(--r2);
  pointer-events: none;
  transition: opacity .8s cubic-bezier(.25, 1, .5, 1);
  z-index: 1;
}
.thread-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
  z-index: 3;
}
.thread-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.thread-pct-big {
  font-size: 28px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -1px;
}
.thread-name {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -.2px;
  margin-bottom: 2px;
  position: relative;
  z-index: 3;
  color: var(--t1);
}
.thread-desc {
  font-size: 11px;
  font-weight: 500;
  color: var(--t2);
  margin-bottom: 12px;
  position: relative;
  z-index: 3;
}
.thread-bar-track {
  height: 7px;
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .05);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
  z-index: 3;
}
.thread-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .6s cubic-bezier(.25, 1, .5, 1);
}
.thread-steps {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  z-index: 3;
}
.thread-step {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: var(--t2);
  cursor: pointer;
  padding: 3px 0;
  user-select: none;
  transition: color .15s;
}
.thread-step:hover { color: var(--t1); }
.step-check {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  transition: all .2s cubic-bezier(.25, 1, .5, 1);
}
.thread-step.done .step-check {
  border-color: #4ade80;
  background: #4ade80;
  color: #fff;
}
.thread-step.done .thread-step-text {
  color: var(--t3);
  text-decoration: line-through;
}
</style>
