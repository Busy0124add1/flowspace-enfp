import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInbox } from '@/stores/useInbox'

describe('useInbox store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initial state is empty', () => {
    const s = useInbox()
    expect(s.items).toEqual([])
    expect(s.search).toBe('')
    expect(s.filterTags).toEqual([])
    expect(s.sortBy).toBe('createdAt')
    expect(s.sortOrder).toBe('desc')
  })

  it('addItem generates id, timestamps, pending status, inserts at head', () => {
    const s = useInbox()
    s.addItem({ content: 'test', url: 'https://ex.com' })
    expect(s.items).toHaveLength(1)
    const it = s.items[0]
    expect(it.id).toMatch(/./)
    expect(it.status).toBe('pending')
    expect(it.tags).toEqual([])
    expect(it.createdAt).toBeLessThanOrEqual(Date.now())
    expect(it.updatedAt).toBe(it.createdAt)
  })

  it('addItem auto-detects URL from content if url not given', () => {
    const s = useInbox()
    s.addItem({ content: 'check https://example.com/x cool' })
    expect(s.items[0].url).toBe('https://example.com/x')
  })

  it('updateStatus updates status + updatedAt', async () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    const id = s.items[0].id
    const orig = s.items[0].updatedAt
    await new Promise((r) => setTimeout(r, 5))
    s.updateStatus(id, 'done')
    expect(s.items[0].status).toBe('done')
    expect(s.items[0].updatedAt).toBeGreaterThan(orig)
  })

  it('updateFields patches specific fields', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    const id = s.items[0].id
    s.updateFields(id, { tags: ['x', 'y'], review: 'done it' })
    expect(s.items[0].tags).toEqual(['x', 'y'])
    expect(s.items[0].review).toBe('done it')
    expect(s.items[0].content).toBe('a')
  })

  it('removeItem removes by id', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.addItem({ content: 'b' })
    s.removeItem(s.items[0].id)
    expect(s.items).toHaveLength(1)
    expect(s.items[0].content).toBe('a') // second-added is now [0] (addItem inserts head)
  })

  it('batchUpdateStatus updates multiple', () => {
    const s = useInbox()
    s.addItem({ content: 'a' }); s.addItem({ content: 'b' }); s.addItem({ content: 'c' })
    const ids = s.items.slice(0, 2).map((i) => i.id)
    s.batchUpdateStatus(ids, 'archived')
    const archivedCount = s.items.filter((i) => i.status === 'archived').length
    expect(archivedCount).toBe(2)
  })

  it('filteredItems applies search on content/url/tags/source/review', () => {
    const s = useInbox()
    s.addItem({ content: 'apple pie recipe' })
    s.addItem({ content: 'banana split' })
    s.search = 'apple'
    expect(s.filteredItems).toHaveLength(1)
    expect(s.filteredItems[0].content).toContain('apple')
  })

  it('filteredItems applies tag filter OR logic', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.updateFields(s.items[0].id, { tags: ['foo'] })
    s.addItem({ content: 'b' })
    s.updateFields(s.items[0].id, { tags: ['bar'] })
    s.addItem({ content: 'c' })
    s.filterTags = ['foo']
    expect(s.filteredItems).toHaveLength(1)
    s.filterTags = ['foo', 'bar']
    expect(s.filteredItems).toHaveLength(2)
  })

  it('filteredItems sorts by createdAt desc by default', () => {
    const s = useInbox()
    s.addItem({ content: 'first' })
    s.addItem({ content: 'second' })
    s.addItem({ content: 'third' })
    // addItem inserts at head so items[0] is newest
    expect(s.filteredItems[0].content).toBe('third')
    expect(s.filteredItems[2].content).toBe('first')
  })

  it('allTags aggregates unique tags across items', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.updateFields(s.items[0].id, { tags: ['x', 'y'] })
    s.addItem({ content: 'b' })
    s.updateFields(s.items[0].id, { tags: ['y', 'z'] })
    expect(s.allTags.sort()).toEqual(['x', 'y', 'z'])
  })

  it('hydrate loads from fs1_inbox_items when present', () => {
    localStorage.setItem('fs1_inbox_items', JSON.stringify([
      { id: 'seed', content: 'pre', status: 'pending', tags: [], createdAt: 1, updatedAt: 1 },
    ]))
    const s = useInbox()
    s.hydrate()
    expect(s.items).toHaveLength(1)
    expect(s.items[0].id).toBe('seed')
  })

  it('persist writes to localStorage', () => {
    const s = useInbox()
    s.addItem({ content: 'persist me' })
    const raw = localStorage.getItem('fs1_inbox_items')
    const parsed = JSON.parse(raw)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].content).toBe('persist me')
  })
})
