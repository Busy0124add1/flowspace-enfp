<template>
  <div class="ic-board">
    <header class="ic-toolbar">
      <div class="ic-toolbar-left">
        <h2 class="ic-title">灵感收件箱</h2>
        <span class="ic-total">共 {{ inbox.items.length }} 条</span>
      </div>
      <div class="ic-toolbar-right">
        <!-- Task 30-33 会在这里插入搜索 / 过滤 / 排序 / 批量 / 新建 -->
        <div class="ic-search">
          <i class="fa-solid fa-search" />
          <input
            v-model="localSearch"
            placeholder="搜索内容、链接、标签……"
            @input="onSearchInput"
          />
          <button v-if="localSearch" class="ic-search-clear" @click="clearSearch">
            <i class="fa-solid fa-times" />
          </button>
        </div>
        <button class="ic-new" @click="triggerCapture">
          <i class="fa-solid fa-plus" />
          <span>新灵感</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
    </header>

    <div class="ic-columns">
      <InboxColumn
        v-for="st in STATUSES"
        :key="st"
        :status="st"
        :items="grouped[st] || []"
        :selected-ids="inbox.selectedIds"
        @select="onSelect"
        @open="onOpen"
        @drop-item="onDropItem"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useInbox } from '@/stores/useInbox'
import InboxColumn from './InboxColumn.vue'

const inbox = useInbox()

const STATUSES = ['pending', 'verifying', 'done', 'archived']

const localSearch = ref(inbox.search)
let searchTimer = null
function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    inbox.search = localSearch.value
  }, 300)
}
function clearSearch() {
  localSearch.value = ''
  inbox.search = ''
}

const grouped = computed(() => {
  const map = { pending: [], verifying: [], done: [], archived: [] }
  for (const it of inbox.filteredItems) {
    ;(map[it.status] || (map[it.status] = [])).push(it)
  }
  return map
})

function onSelect(id, v) {
  if (v) {
    if (!inbox.selectedIds.includes(id)) inbox.selectedIds.push(id)
  } else {
    inbox.selectedIds = inbox.selectedIds.filter((x) => x !== id)
  }
}
function onOpen(id) {
  // Task 37 / Batch 3 Task P7 接 Edit Dialog
  window.dispatchEvent(new CustomEvent('fs1:inbox-open', { detail: id }))
}
function onDropItem(id, targetStatus) {
  inbox.updateStatus(id, targetStatus)
}
function triggerCapture() {
  window.dispatchEvent(new CustomEvent('fs1:open-capture'))
}
</script>

<style scoped>
.ic-board {
  padding: 20px;
  height: calc(100vh - 52px);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.ic-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.ic-toolbar-left { display: flex; align-items: baseline; gap: 12px; }
.ic-title { font-size: 18px; font-weight: 800; margin: 0; color: var(--t1); }
.ic-total { font-size: 12px; color: var(--t3); }

.ic-toolbar-right { display: flex; align-items: center; gap: 8px; }
.ic-new {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 7px 12px;
  border-radius: var(--r);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.ic-new:hover { transform: scale(1.04); }
.ic-new kbd {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
  font-family: inherit;
}

.ic-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow-y: auto;
  min-height: 0;
}

.ic-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  min-width: 220px;
}
.ic-search i { color: var(--t3); font-size: 11px; }
.ic-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  font-size: 12px;
  padding: 4px 0;
}
.ic-search input::placeholder { color: var(--t3); }
.ic-search-clear {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 10px;
  padding: 2px;
}
.ic-search-clear:hover { color: var(--t1); }
</style>
