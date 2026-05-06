<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-th-large" />
      <span>四象限待办</span>
      <span class="spacer" />
      <span class="count">{{ activeTodos.length }}</span>
      <button class="todo-collapse-btn" :class="{ collapsed }" @click="toggleCollapse">
        <i class="fa-solid fa-chevron-down" />
      </button>
    </h3>

    <div class="todo-section-body" :class="{ collapsed }">
      <div class="todo-add-row">
        <input
          v-model="newText"
          class="todo-input"
          placeholder="新增待办……"
          @keyup.enter="addTodo"
        />
        <select v-model="newQ" class="q-select">
          <option value="ui">紧急重要</option>
          <option value="si">不急重要</option>
          <option value="un">紧急不重要</option>
          <option value="nn">不急不重要</option>
        </select>
        <button class="todo-btn" @click="addTodo"><i class="fa-solid fa-plus" /></button>
      </div>

      <div class="q-matrix-wrap" ref="matrixRef">
        <div class="q-tint ui" />
        <div class="q-tint si" />
        <div class="q-tint un" />

        <div class="q-axis-label top">重要</div>
        <div class="q-axis-label bottom">不重要</div>
        <div class="q-axis-label left">紧急</div>
        <div class="q-axis-label right">不紧急</div>

        <div class="q-corner ui">紧急重要</div>
        <div class="q-corner si">不急重要</div>
        <div class="q-corner un">紧急不重要</div>

        <div
          v-for="t in activeTodos"
          :key="t.id"
          class="q-dot"
          :class="{ done: t.done, 'dragging-dot': draggingId === t.id, hover: activeTooltipId === t.id }"
          :style="{ left: `${t.x}%`, top: `${t.y}%`, background: dotColor(t) }"
          @mousedown="onDotDown($event, t)"
          @mouseenter="showTooltip(t)"
          @mouseleave="scheduleHide"
        />

        <div
          v-if="activeTooltipId"
          class="q-tooltip"
          :style="{ left: `${tooltipPos.x}%`, top: `${tooltipPos.y}%` }"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <div class="q-tooltip-text">{{ tooltipTodo?.text }}</div>
          <div class="q-tooltip-actions">
            <button class="q-tip-btn done-btn" @click="doneFromTooltip($event)">完成</button>
            <button class="q-tip-btn del-btn" @click="removeFromTooltip">删除</button>
          </div>
        </div>

        <div class="q-done-panel">
          <div class="q-done-label">已完成</div>
          <div class="q-done-list">
            <div v-for="t in doneTodos" :key="t.id" class="q-done-item">
              <span class="q-done-check"><i class="fa-solid fa-check" /></span>
              <span class="q-done-text">{{ t.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="todo-stats">
        <span class="todo-stat-text">{{ doneTodos.length }} / {{ ws.todos.length }}</span>
        <div class="todo-progress-bar">
          <div class="todo-progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
        <span class="todo-stat-text">{{ progressPct }}%</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'
import { load, save } from '@/services/storage'

const ws = useWorkspace()
const matrixRef = ref(null)
const newText = ref('')
const newQ = ref('ui')
const draggingId = ref(null)

const collapsed = ref(load('todo_collapsed', false))
function toggleCollapse() {
  collapsed.value = !collapsed.value
  save('todo_collapsed', collapsed.value)
}

const activeTodos = computed(() => ws.todos.filter((t) => !t.done))
const doneTodos = computed(() => ws.todos.filter((t) => t.done))
const progressPct = computed(() => {
  if (ws.todos.length === 0) return 0
  return Math.round((doneTodos.value.length / ws.todos.length) * 100)
})

const emit = defineEmits(['todo-done'])

function addTodo() {
  const text = newText.value.trim()
  if (!text) return
  const positions = { ui: [25, 25], si: [75, 25], un: [25, 75], nn: [75, 75] }
  const [x, y] = positions[newQ.value]
  ws.upsertTodo({
    id: 'td' + Date.now(),
    text, x, y, q: newQ.value, done: false,
  })
  newText.value = ''
}

function dotColor(t) {
  const map = { ui: '#f0537a', si: '#f5a623', un: '#3ecfcf', nn: '#9b6dff' }
  return map[t.q] || '#ffffff'
}

// ---- 拖拽（原生 mouse 事件，不用 HTML5 DnD，因为 dot 是绝对定位）----
let dragTodo = null
function onDotDown(e, t) {
  e.preventDefault()
  dragTodo = t
  draggingId.value = t.id
  window.addEventListener('mousemove', onDotMove)
  window.addEventListener('mouseup', onDotUp)
}
function onDotMove(e) {
  if (!dragTodo || !matrixRef.value) return
  const rect = matrixRef.value.getBoundingClientRect()
  const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100))
  const y = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100))
  dragTodo.x = x
  dragTodo.y = y
  dragTodo.q = classifyQuadrant(x, y)
}
function onDotUp() {
  if (dragTodo) {
    ws.upsertTodo({ ...dragTodo })
    dragTodo = null
    draggingId.value = null
  }
  window.removeEventListener('mousemove', onDotMove)
  window.removeEventListener('mouseup', onDotUp)
}
function classifyQuadrant(x, y) {
  if (y < 50) return x < 50 ? 'ui' : 'si'
  return x < 50 ? 'un' : 'nn'
}
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDotMove)
  window.removeEventListener('mouseup', onDotUp)
  clearTimeout(hideTimer)
})

// ---- tooltip 状态机（v2-7 延迟隐藏） ----
const activeTooltipId = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const tooltipTodo = computed(() => ws.todos.find((t) => t.id === activeTooltipId.value))
let hideTimer = null

function showTooltip(t) {
  cancelHide()
  activeTooltipId.value = t.id
  tooltipPos.value = { x: t.x, y: t.y }
}
function scheduleHide() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    activeTooltipId.value = null
  }, 300)
}
function cancelHide() {
  clearTimeout(hideTimer)
}
function doneFromTooltip(event) {
  const t = tooltipTodo.value
  if (!t) return
  ws.upsertTodo({ ...t, done: true })
  emit('todo-done', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
  activeTooltipId.value = null
}
function removeFromTooltip() {
  const t = tooltipTodo.value
  if (!t) return
  ws.removeTodo(t.id)
  activeTooltipId.value = null
}

// ---- 完成 action（tooltip 里调用，Task 19 补 tooltip；这里先暴露 markDone 便于测试）----
function markDone(t, event) {
  ws.upsertTodo({ ...t, done: true })
  if (event) emit('todo-done', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
}
defineExpose({ markDone })
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
.panel-title .spacer { flex: 1; }
.count {
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
}
.todo-collapse-btn {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  margin-left: 8px;
  transition: color 0.15s, transform 0.2s;
  display: flex;
  align-items: center;
}
.todo-collapse-btn:hover { color: var(--t1); }
.todo-collapse-btn.collapsed { transform: rotate(-90deg); }

.todo-section-body {
  max-height: 800px;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.todo-section-body.collapsed { max-height: 0; }

/* ==== todo 控件 ==== */
.todo-add-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.todo-input {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 12px;
  font: 13px/1 "Outfit", sans-serif;
  color: var(--t1);
  outline: none;
  transition: border-color 0.2s;
}
.todo-input:focus { border-color: var(--accent); }
.todo-input::placeholder { color: var(--t3); }
.q-select {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 6px;
  font-size: 11px;
  color: var(--t2);
  outline: none;
  cursor: pointer;
  font-family: inherit;
  max-width: 80px;
}
.todo-btn {
  width: 34px;
  height: 34px;
  background: var(--accent);
  border: none;
  border-radius: var(--r);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.todo-btn:hover { opacity: 0.85; transform: scale(1.06); }

/* ==== 矩阵 ==== */
.q-matrix-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  overflow: hidden;
  user-select: none;
}
.q-matrix-wrap::before,
.q-matrix-wrap::after {
  content: '';
  position: absolute;
  background: var(--line);
  pointer-events: none;
  z-index: 1;
}
.q-matrix-wrap::before {
  left: 50%; top: 8px; bottom: 8px; width: 1px;
  transform: translateX(-50%);
}
.q-matrix-wrap::after {
  top: 50%; left: 8px; right: 8px; height: 1px;
  transform: translateY(-50%);
}

/* v2-6b 径向渐变 */
.q-tint { position: absolute; pointer-events: none; z-index: 0; }
.q-tint.ui {
  top: 0; left: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--pink) 8%, transparent), transparent 70%);
}
.q-tint.si {
  top: 0; right: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--amber) 8%, transparent), transparent 70%);
}
.q-tint.un {
  bottom: 0; left: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--cyan) 6%, transparent), transparent 70%);
}

.q-axis-label {
  position: absolute;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--t3);
  pointer-events: none;
  z-index: 2;
}
.q-axis-label.top    { top: 6px; left: 50%; transform: translateX(-50%); }
.q-axis-label.bottom { bottom: 6px; left: 50%; transform: translateX(-50%); }
.q-axis-label.left   { left: 6px; top: 50%; transform: translateY(-50%) rotate(-90deg); }
.q-axis-label.right  { right: 6px; top: 50%; transform: translateY(-50%) rotate(90deg); }

.q-corner {
  position: absolute;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.55;
}
.q-corner.ui { top: 10px; left: 10px; color: var(--pink); }
.q-corner.si { top: 10px; right: 10px; color: var(--amber); }
.q-corner.un { bottom: 10px; left: 10px; color: var(--cyan); }

.q-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1.5px solid rgba(0, 0, 0, 0.25);
}
.q-dot:hover, .q-dot.hover { transform: translate(-50%, -50%) scale(1.6); z-index: 20; }
.q-dot.done { opacity: 0.35; filter: grayscale(0.6); }
.q-dot.dragging-dot { opacity: 0.6; cursor: grabbing; z-index: 30; }

.q-done-panel {
  position: absolute;
  bottom: 0; right: 0;
  width: 50%; height: 50%;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 6px;
  pointer-events: none;  /* 让 dot 可以叠到这里 */
}
.q-done-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--t3);
  opacity: 0.55;
  margin-bottom: 4px;
  flex-shrink: 0;
}
.q-done-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: auto;
}
.q-done-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 9.5px;
  color: var(--t3);
}
.q-done-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--t2); }
.q-done-check {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade8033;
  border: 1px solid #4ade8066;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: #4ade80;
}
.q-done-text {
  flex: 1;
  text-decoration: line-through;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 7px 10px;
  background: var(--bg);
  border-radius: var(--r);
  border: 1px solid var(--line);
}
.todo-progress-bar {
  flex: 1;
  height: 4px;
  background: var(--line);
  border-radius: 99px;
  overflow: hidden;
  margin: 0 10px;
}
.todo-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--pink));
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.todo-stat-text {
  font-size: 11px;
  color: var(--t3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ==== v2-7 tooltip ==== */
.q-tooltip {
  position: absolute;
  background: #1e1f28;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  color: var(--t1);
  pointer-events: auto;
  z-index: 50;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -130%);
  max-width: 160px;
  white-space: normal;
  line-height: 1.4;
}
.q-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #1e1f28;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}
.q-tooltip-actions {
  display: flex;
  gap: 5px;
  margin-top: 6px;
}
.q-tip-btn {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}
.q-tip-btn:hover { opacity: 0.8; }
.q-tip-btn.done-btn {
  background: #4ade8022;
  color: #4ade80;
  border: 1px solid #4ade8044;
}
.q-tip-btn.del-btn {
  background: #f0537a22;
  color: #f0537a;
  border: 1px solid #f0537a44;
}
</style>
