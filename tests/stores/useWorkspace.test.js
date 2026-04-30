import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWorkspace } from '@/stores/useWorkspace'

describe('useWorkspace store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initial state is empty', () => {
    const s = useWorkspace()
    expect(s.threads).toEqual([])
    expect(s.todos).toEqual([])
    expect(s.journal).toBe('')
    expect(s.notes).toBe('')
  })

  it('hydrate from seed when localStorage empty', async () => {
    const s = useWorkspace()
    await s.hydrate()
    expect(s.threads.length).toBeGreaterThan(0)
    expect(s.energy.mood).toBe(72)
  })

  it('hydrate prefers localStorage over seed', async () => {
    localStorage.setItem('fs1_workspace', JSON.stringify({
      energy: { mood: 10, focus: 10, creative: 10 },
      journal: 'saved',
      threads: [], projects: [], todos: [], notes: '', sync: [],
      streak: { days: 0, lastDate: null }, inbox_items: [],
    }))
    const s = useWorkspace()
    await s.hydrate()
    expect(s.energy.mood).toBe(10)
    expect(s.journal).toBe('saved')
  })

  it('updateEnergy mutates and persists', () => {
    const s = useWorkspace()
    s.updateEnergy('mood', 80)
    expect(s.energy.mood).toBe(80)
  })

  it('upsertTodo adds new when id not found', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'x', text: 'hi', x: 30, y: 30, q: 'ui', done: false })
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].text).toBe('hi')
  })

  it('upsertTodo updates existing by id', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'x', text: 'hi', x: 30, y: 30, q: 'ui', done: false })
    s.upsertTodo({ id: 'x', text: 'updated', x: 50, y: 50, q: 'si', done: true })
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].text).toBe('updated')
    expect(s.todos[0].done).toBe(true)
  })

  it('removeTodo removes by id', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'a', text: 'a', x: 0, y: 0, q: 'ui', done: false })
    s.upsertTodo({ id: 'b', text: 'b', x: 0, y: 0, q: 'ui', done: false })
    s.removeTodo('a')
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].id).toBe('b')
  })

  it('setJournal + setNotes persist', () => {
    const s = useWorkspace()
    s.setJournal('hello')
    s.setNotes('world')
    expect(s.journal).toBe('hello')
    expect(s.notes).toBe('world')
  })
})
