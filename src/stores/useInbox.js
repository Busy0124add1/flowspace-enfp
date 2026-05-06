import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'

const URL_RE = /(https?:\/\/\S+)/

function extractUrl(text) {
  const m = text.match(URL_RE)
  return m ? m[1].replace(/[，。、；！？)）】」]+$/, '') : null
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'i' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

export const useInbox = defineStore('inbox', {
  state: () => ({
    items: [],
    search: '',
    filterTags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    selectedIds: [],    // 用数组替代 Set 以便 Pinia 响应式友好
  }),
  getters: {
    allTags(state) {
      const set = new Set()
      for (const it of state.items) {
        for (const t of it.tags || []) set.add(t)
      }
      return Array.from(set)
    },
    filteredItems(state) {
      let list = state.items

      // search
      if (state.search) {
        const q = state.search.toLowerCase()
        list = list.filter((it) => {
          const hay = [
            it.content,
            it.url || '',
            (it.tags || []).join(' '),
            it.source || '',
            it.review || '',
          ].join(' ').toLowerCase()
          return hay.includes(q)
        })
      }

      // tag filter (OR)
      if (state.filterTags.length > 0) {
        list = list.filter((it) => (it.tags || []).some((t) => state.filterTags.includes(t)))
      }

      // sort
      const dir = state.sortOrder === 'desc' ? -1 : 1
      list = [...list].sort((a, b) => {
        const av = a[state.sortBy] ?? ''
        const bv = b[state.sortBy] ?? ''
        if (av < bv) return -1 * dir
        if (av > bv) return 1 * dir
        return 0
      })

      return list
    },
  },
  actions: {
    hydrate() {
      const saved = load('inbox_items', null)
      if (Array.isArray(saved)) this.items = saved
    },
    persist() {
      save('inbox_items', this.items)
    },
    addItem({ content, url }) {
      const finalUrl = url ?? extractUrl(content)
      const now = Date.now()
      const it = {
        id: genId(),
        content,
        url: finalUrl || undefined,
        status: 'pending',
        tags: [],
        source: undefined,
        review: undefined,
        createdAt: now,
        updatedAt: now,
      }
      this.items.unshift(it)
      this.persist()
      return it
    },
    updateStatus(id, newStatus) {
      const it = this.items.find((i) => i.id === id)
      if (!it) return
      it.status = newStatus
      it.updatedAt = Date.now()
      this.persist()
    },
    updateFields(id, patch) {
      const it = this.items.find((i) => i.id === id)
      if (!it) return
      Object.assign(it, patch)
      it.updatedAt = Date.now()
      this.persist()
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this.selectedIds = this.selectedIds.filter((x) => x !== id)
      this.persist()
    },
    batchUpdateStatus(ids, newStatus) {
      const now = Date.now()
      for (const it of this.items) {
        if (ids.includes(it.id)) {
          it.status = newStatus
          it.updatedAt = now
        }
      }
      this.persist()
    },
    toggleSelect(id) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((x) => x !== id)
      } else {
        this.selectedIds.push(id)
      }
    },
    selectAllVisible() {
      this.selectedIds = this.filteredItems.map((i) => i.id)
    },
    clearSelection() {
      this.selectedIds = []
    },
  },
})
