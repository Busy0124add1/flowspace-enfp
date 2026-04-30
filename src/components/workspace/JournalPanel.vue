<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-pen-nib" />
      今日随笔
      <span class="save-hint" v-if="lastSavedAt">保存于 {{ savedText }}</span>
    </h3>
    <textarea
      v-model="text"
      class="journal-input"
      placeholder="今天发生了什么……"
      rows="4"
    />
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'
import { timeAgo } from '@/utils/time'

const ws = useWorkspace()
const text = ref(ws.journal)
const lastSavedAt = ref(null)
let timer = null

// store → local
watch(() => ws.journal, (v) => {
  if (v !== text.value) text.value = v
})

// local → store (debounce 300ms)
watch(text, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    ws.setJournal(v)
    lastSavedAt.value = Date.now()
  }, 300)
})

const savedText = computed(() => lastSavedAt.value ? timeAgo(lastSavedAt.value) : '')
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
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }
.save-hint {
  margin-left: auto;
  font-size: 10px;
  color: var(--t3);
  font-weight: 500;
}
.journal-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
  color: var(--t1);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}
.journal-input:focus { border-color: var(--accent); }
</style>
