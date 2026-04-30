<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-layer-group" />
      并行任务线
    </h3>
    <div class="threads-grid">
      <article
        v-for="t in ws.threads"
        :key="t.id"
        class="thread"
        :class="{ complete: t.pct >= 100 }"
        :style="{ '--tc': t.color }"
      >
        <div class="thread-head">
          <div class="thread-ico" :style="{ background: `${t.color}22`, color: t.color }">
            <i class="fa-solid fa-diamond" />
          </div>
          <div class="thread-pct-big" :style="{ color: t.color }">{{ t.pct }}</div>
        </div>
        <div class="thread-name">{{ t.name }}</div>
        <div class="thread-desc">{{ t.desc }}</div>
        <div class="thread-bar-track">
          <div class="thread-bar-fill" :style="{ width: `${t.pct}%`, background: t.color }" />
        </div>
        <div class="thread-steps">
          <div
            v-for="(s, i) in t.steps"
            :key="i"
            class="thread-step"
            :class="{ done: s.done }"
            @click="toggleStep(t, i, $event)"
          >
            <span class="step-check" :style="s.done ? { borderColor: t.color, background: t.color } : {}">
              <i v-if="s.done" class="fa-solid fa-check" />
            </span>
            <span class="thread-step-text">{{ s.text }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()
const emit = defineEmits(['step-done', 'thread-complete'])

function toggleStep(thread, idx, event) {
  const step = thread.steps[idx]
  const wasDone = step.done
  step.done = !step.done
  // 重算进度：done 步骤数 / 总步数 * 100
  const doneCount = thread.steps.filter((s) => s.done).length
  const newPct = Math.round((doneCount / thread.steps.length) * 100)
  const wasComplete = thread.pct >= 100
  thread.pct = newPct
  ws.upsertThread({ ...thread })
  // 反馈：新完成一个子步骤 → emit step-done；刚好跨 100 → emit thread-complete
  if (!wasDone) {
    const origin = { x: event.clientX, y: event.clientY }
    const el = event.currentTarget
    emit('step-done', { el, origin })
    if (!wasComplete && newPct >= 100) {
      emit('thread-complete', { el: el.closest('.thread'), origin })
    }
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

.threads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
}

.thread {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}
.thread.complete {
  box-shadow: 0 0 0 1.5px var(--tc, #fff), 0 0 22px color-mix(in srgb, var(--tc, #fff) 30%, transparent);
}

.thread-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
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
  letter-spacing: -1.5px;   /* v2-3 微调 */
}

/* v2-3 字体改进 */
.thread-name {
  font-size: 14px;          /* v2-3: 13 → 14 */
  font-weight: 800;         /* v2-3: 700 → 800 */
  letter-spacing: -0.2px;   /* v2-3 新增 */
  margin-bottom: 2px;
  color: var(--t1);
}
.thread-desc {
  font-size: 11px;
  font-weight: 500;         /* v2-3 新增 */
  color: var(--t2);         /* v2-3: t3 → t2 */
  margin-bottom: 12px;
}

.thread-bar-track {
  height: 7px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 12px;
}
.thread-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.thread-steps {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.thread-step {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;        /* v2-3: 11 → 11.5 */
  font-weight: 500;         /* v2-3 新增 */
  color: var(--t2);
  cursor: pointer;
  padding: 3px 0;
  user-select: none;
  transition: color 0.15s;
}
.thread-step:hover { color: var(--t1); }
.thread-step.done .step-check { color: #fff; }
.thread-step.done .thread-step-text {
  color: var(--t3);
  text-decoration: line-through;
}
.step-check {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--t3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  flex-shrink: 0;
  transition: all 0.15s;
}
</style>
