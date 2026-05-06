<template>
  <section
    class="ic-col"
    :class="{ 'is-drop-hover': dropHover, [`col-${status}`]: true }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="ic-col-head">
      <span class="ic-col-label">{{ label }}</span>
      <span class="ic-col-count">{{ items.length }}</span>
    </header>

    <div class="ic-col-body">
      <InboxCard
        v-for="it in items"
        :key="it.id"
        :item="it"
        :selected="selectedIds.includes(it.id)"
        @select="(id, v) => $emit('select', id, v)"
        @open="(id) => $emit('open', id)"
      />

      <div v-if="items.length === 0" class="ic-col-empty">
        {{ emptyText }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import InboxCard from './InboxCard.vue'

const props = defineProps({
  status: { type: String, required: true },
  items: { type: Array, required: true },
  selectedIds: { type: Array, default: () => [] },
})
const emit = defineEmits(['select', 'open', 'drop-item'])

const dropHover = ref(false)

const LABELS = {
  pending: '未处理', verifying: '验证中', done: '完成', archived: '舍弃',
}
const EMPTIES = {
  pending: 'Ctrl+K 记下灵感',
  verifying: '拖动卡片到这里',
  done: '完成后的收获会汇聚于此',
  archived: '',
}

const label = computed(() => LABELS[props.status] || props.status)
const emptyText = computed(() => EMPTIES[props.status] || '')

function onDragOver(e) {
  e.dataTransfer.dropEffect = 'move'
  dropHover.value = true
}
function onDragLeave() { dropHover.value = false }
function onDrop(e) {
  dropHover.value = false
  const id = e.dataTransfer.getData('text/plain')
  if (id) emit('drop-item', id, props.status)
}
</script>

<style scoped>
.ic-col {
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  display: flex;
  flex-direction: column;
  min-height: 400px;
  transition: border-color 0.15s, background 0.15s;
}
.ic-col.is-drop-hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 5%, var(--surf));
}

.ic-col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
}
.ic-col-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--t2);
}
.ic-col-count {
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: 99px;
  min-width: 24px;
  text-align: center;
}

.ic-col.col-pending .ic-col-label { color: var(--accent); }
.ic-col.col-verifying .ic-col-label { color: #f5a623; }
.ic-col.col-done .ic-col-label { color: #4ade80; }
.ic-col.col-archived .ic-col-label { color: var(--t3); }

.ic-col-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ic-col-empty {
  color: var(--t3);
  font-size: 11px;
  text-align: center;
  padding: 30px 10px;
  border: 1px dashed var(--line);
  border-radius: var(--r);
  margin-top: 8px;
}
</style>
