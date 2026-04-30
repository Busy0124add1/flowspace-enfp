<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-note-sticky" />
      <span>快捷笔记</span>
      <span class="spacer" />
      <button class="new-inspire-btn" title="Ctrl+K 快速记录灵感" @click="triggerCapture">
        <i class="fa-solid fa-lightbulb" />
        <span>新灵感</span>
        <kbd>⌘K</kbd>
      </button>
    </h3>
    <textarea
      v-model="text"
      class="notes-input"
      placeholder="随手写点什么……Ctrl+Enter 保存"
      rows="4"
      @keydown.ctrl.enter.prevent="saveNotes"
      @keydown.meta.enter.prevent="saveNotes"
    />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'
import { useToast } from 'primevue/usetoast'

const ws = useWorkspace()
const toast = useToast()
const text = ref(ws.notes)

watch(() => ws.notes, (v) => { if (v !== text.value) text.value = v })

function saveNotes() {
  ws.setNotes(text.value)
  toast.add({ severity: 'success', summary: '已记下', life: 2000 })
}

function triggerCapture() {
  // 广播到全局：Batch 3 的 useHotkey 会监听
  window.dispatchEvent(new CustomEvent('fs1:open-capture'))
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
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }
.panel-title .spacer { flex: 1; }

.new-inspire-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--accent);
  border-radius: var(--r);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.new-inspire-btn:hover { background: color-mix(in srgb, var(--accent) 20%, transparent); }
.new-inspire-btn kbd {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
  color: var(--t3);
  font-family: inherit;
}

.notes-input {
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
.notes-input:focus { border-color: var(--accent); }
</style>
