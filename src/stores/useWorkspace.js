import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'

const EMPTY_STATE = () => ({
  energy: { mood: 50, focus: 50, creative: 50 },
  journal: '',
  threads: [],
  projects: [],
  todos: [],
  notes: '',
  sync: [],
  streak: { days: 0, lastDate: null },
  inbox_items: [],
})

export const useWorkspace = defineStore('workspace', {
  state: () => EMPTY_STATE(),
  actions: {
    async hydrate() {
      const saved = load('workspace')
      if (saved) {
        Object.assign(this, saved)
        return
      }
      // 尝试 fetch seed；失败时（如测试环境）使用静态导入
      let seed = null
      try {
        const res = await fetch('/src/mocks/seed.json')
        if (res.ok) seed = await res.json()
      } catch {}
      if (!seed) {
        const mod = await import('@/mocks/seed.json')
        seed = mod.default || mod
      }
      if (seed) {
        Object.assign(this, seed)
        this.persist()
      }
    },
    persist() {
      const { energy, journal, threads, projects, todos, notes, sync, streak, inbox_items } = this
      save('workspace', { energy, journal, threads, projects, todos, notes, sync, streak, inbox_items })
    },
    updateEnergy(key, value) {
      this.energy[key] = value
      this.persist()
    },
    setJournal(v) { this.journal = v; this.persist() },
    setNotes(v) { this.notes = v; this.persist() },
    upsertThread(t) {
      const i = this.threads.findIndex((x) => x.id === t.id)
      if (i >= 0) this.threads[i] = { ...this.threads[i], ...t }
      else this.threads.push(t)
      this.persist()
    },
    removeThread(id) {
      this.threads = this.threads.filter((t) => t.id !== id)
      this.persist()
    },
    upsertTodo(t) {
      const i = this.todos.findIndex((x) => x.id === t.id)
      if (i >= 0) this.todos[i] = { ...this.todos[i], ...t }
      else this.todos.push(t)
      this.persist()
    },
    removeTodo(id) {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.persist()
    },
    advanceProject(id) {
      const p = this.projects.find((x) => x.id === id)
      if (p && p.stage < p.stages.length - 1) { p.stage++; this.persist() }
    },
  },
})
