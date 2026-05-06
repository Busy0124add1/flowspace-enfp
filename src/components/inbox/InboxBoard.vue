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
        <MultiSelect
          :model-value="inbox.filterTags"
          :options="tagOptions"
          placeholder="标签"
          display="chip"
          class="ic-tag-filter"
          :pt="{ root: 'ic-tag-filter-root', panel: 'ic-tag-filter-panel' }"
          @update:model-value="(v) => inbox.filterTags = v"
        />
        <Select
          :model-value="sortValue"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          class="ic-sort"
          :pt="{ root: 'ic-sort-root' }"
          @update:model-value="onSortChange"
        />
        <button class="ic-new" @click="triggerCapture">
          <i class="fa-solid fa-plus" />
          <span>新灵感</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
    </header>

    <div v-if="inbox.selectedIds.length > 0" class="ic-batch-bar">
      <span class="ic-batch-count">已选 {{ inbox.selectedIds.length }} 条</span>
      <button class="ic-batch-btn" @click="inbox.selectAllVisible()">全选可见</button>
      <button class="ic-batch-btn" @click="inbox.clearSelection()">取消</button>
      <span class="ic-batch-spacer" />
      <button class="ic-batch-btn done-btn" @click="batchDone">批量完成</button>
      <button class="ic-batch-btn arc-btn" @click="batchArchive">批量舍弃</button>
    </div>

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
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'

const inbox = useInbox()

const STATUSES = ['pending', 'verifying', 'done', 'archived']

const tagOptions = computed(() => inbox.allTags)

const sortOptions = [
  { label: '最新', value: 'createdAt:desc' },
  { label: '最早', value: 'createdAt:asc' },
  { label: '最近更新', value: 'updatedAt:desc' },
  { label: '按来源', value: 'source:asc' },
]
const sortValue = computed(() => `${inbox.sortBy}:${inbox.sortOrder}`)
function onSortChange(v) {
  const [by, order] = v.split(':')
  inbox.sortBy = by
  inbox.sortOrder = order
}

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
function batchDone() {
  inbox.batchUpdateStatus([...inbox.selectedIds], 'done')
  inbox.clearSelection()
}
function batchArchive() {
  inbox.batchUpdateStatus([...inbox.selectedIds], 'archived')
  inbox.clearSelection()
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

.ic-batch-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: var(--r);
  margin-bottom: 12px;
  font-size: 12px;
}
.ic-batch-count {
  color: var(--accent);
  font-weight: 700;
}
.ic-batch-spacer { flex: 1; }
.ic-batch-btn {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--t1);
  padding: 5px 10px;
  border-radius: var(--r);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.ic-batch-btn:hover { border-color: var(--accent); }
.ic-batch-btn.done-btn { color: #4ade80; border-color: #4ade8044; }
.ic-batch-btn.done-btn:hover { background: #4ade8022; }
.ic-batch-btn.arc-btn { color: var(--t2); }

.ic-tag-filter { min-width: 140px; }
</style>

<style>
.ic-tag-filter-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
  display: inline-flex;
  align-items: center;
}
.ic-tag-filter-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.ic-tag-filter-panel [data-pc-section="header"] { padding: 6px; }
.ic-tag-filter-panel [data-pc-section="option"] {
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
  border-radius: 4px;
}
.ic-tag-filter-panel [data-pc-section="option"]:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
.ic-sort-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
}
</style>
