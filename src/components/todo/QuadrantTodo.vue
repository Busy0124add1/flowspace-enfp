<script setup>
import { ref, computed } from 'vue'
import { useTodosStore } from '@/stores/todos'

const store = useTodosStore()

const activeTooltip = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const dragOverQuadrant = ref(null)

const quadrants = [
  { id: 'ui', label: '紧急&重要', bg: 'var(--pink)', color: '#fff' },
  { id: 'si', label: '不紧急&重要', bg: 'var(--cyan)', color: '#000' },
  { id: 'un', label: '紧急&不重要', bg: 'var(--amber)', color: '#000' },
]

const doneTodos = computed(() => store.doneTodos)

function getTodosByQuadrant(q) {
  return store.todos.filter(t => t.quadrant === q)
}

function getDotStyle(todo) {
  return {
    left: `${todo.x}%`,
    top: `${todo.y}%`,
    background: getQuadrantColor(todo.quadrant)
  }
}

function getQuadrantColor(q) {
  const qd = quadrants.find(qd => qd.id === q)
  return qd ? qd.bg : 'var(--t3)'
}

function showTooltip(todo, event) {
  activeTooltip.value = todo
  tooltipPos.value = { x: event.clientX, y: event.clientY }
}

function hideTooltip() {
  activeTooltip.value = null
}

function handleToggle(id) {
  store.toggleTodo(id)
  hideTooltip()
}

function handleDelete(id) {
  store.deleteTodo(id)
  hideTooltip()
}

function handleDragStart(event, todo) {
  event.dataTransfer.setData('todoId', todo.id)
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function handleDrop(event, quadrant) {
  event.preventDefault()
  const id = event.dataTransfer.getData('todoId')
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  store.moveTodo(id, quadrant, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)))
  dragOverQuadrant.value = null
}

function onDragEnter(quadrant) {
  dragOverQuadrant.value = quadrant
}

function onDragLeave() {
  dragOverQuadrant.value = null
}
</script>

<template>
  <div class="quadrant-todo">
    <div class="quadrant-grid">
      <div
        v-for="q in quadrants"
        :key="q.id"
        class="quadrant"
        :class="{ 'drag-over': dragOverQuadrant === q.id }"
        :style="{ '--q-bg': q.bg }"
        @dragover="handleDragOver"
        @drop="handleDrop($event, q.id)"
        @dragenter="onDragEnter(q.id)"
        @dragleave="onDragLeave"
      >
        <div class="quadrant-label" :style="{ color: q.bg }">{{ q.label }}</div>
        <div class="quadrant-area">
          <div
            v-for="todo in getTodosByQuadrant(q.id)"
            :key="todo.id"
            class="todo-dot"
            :style="getDotStyle(todo)"
            draggable="true"
            @click="showTooltip(todo, $event)"
            @dragstart="handleDragStart($event, todo)"
          ></div>
        </div>
      </div>
    </div>

    <div class="done-section">
      <div class="done-label">已完成</div>
      <div class="done-list">
        <div v-for="todo in doneTodos" :key="todo.id" class="done-item">
          <i class="fa-solid fa-check"></i>
          <span>{{ todo.text }}</span>
          <button class="item-del-btn" @click="handleDelete(todo.id)">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div v-if="doneTodos.length === 0" class="empty-done">暂无已完成项</div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="activeTooltip"
        class="todo-tooltip"
        :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
        @click.stop
      >
        <div class="tooltip-text">{{ activeTooltip.text }}</div>
        <div class="tooltip-actions">
          <button class="tooltip-btn done-btn" @click="handleToggle(activeTooltip.id)">
            <i class="fa-solid fa-check"></i> 完成
          </button>
          <button class="tooltip-btn del-btn" @click="handleDelete(activeTooltip.id)">
            <i class="fa-solid fa-trash"></i> 删除
          </button>
        </div>
      </div>
      <div v-if="activeTooltip" class="tooltip-overlay" @click="hideTooltip"></div>
    </Teleport>
  </div>
</template>

<style scoped>
.quadrant-todo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quadrant-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 280px;
}

.quadrant {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px;
  position: relative;
  transition: border-color 0.2s;
}

.quadrant.drag-over {
  border-color: var(--q-bg);
}

.quadrant-label {
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 4px;
}

.quadrant-area {
  position: relative;
  width: 100%;
  height: calc(100% - 20px);
}

.todo-dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 0.15s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.todo-dot:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

.done-section {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
}

.done-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--t3);
  margin-bottom: 8px;
}

.done-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100px;
  overflow-y: auto;
}

.done-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--t3);
}

.done-item i.fa-check {
  color: var(--lime);
}

.done-item span {
  flex: 1;
  text-decoration: line-through;
}

.item-del-btn {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  padding: 2px 4px;
  font-size: 10px;
}

.item-del-btn:hover {
  color: var(--pink);
}

.empty-done {
  font-size: 11px;
  color: var(--t3);
  text-align: center;
  padding: 8px 0;
}

.todo-tooltip {
  position: fixed;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
  z-index: 9999;
  transform: translate(-50%, -110%);
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.tooltip-text {
  font-size: 12px;
  color: var(--t1);
  margin-bottom: 8px;
  word-break: break-word;
}

.tooltip-actions {
  display: flex;
  gap: 6px;
}

.tooltip-btn {
  flex: 1;
  padding: 5px 8px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: opacity 0.15s;
}

.tooltip-btn:hover {
  opacity: 0.85;
}

.done-btn {
  background: var(--lime);
  color: #000;
}

.del-btn {
  background: var(--pink);
  color: #fff;
}

.tooltip-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
</style>