import { describe, it, expect, vi, afterEach } from 'vitest'
import { matchHotkey } from '@/composables/useHotkey'

describe('matchHotkey', () => {
  it('matches Ctrl+K on non-mac', () => {
    const ev = { key: 'k', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('matches Cmd+K on mac', () => {
    const ev = { key: 'k', ctrlKey: false, metaKey: true, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('ignores Ctrl+K+Shift when pattern is mod+k', () => {
    const ev = { key: 'k', ctrlKey: true, shiftKey: true, metaKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(false)
  })

  it('matches case-insensitive key', () => {
    const ev = { key: 'K', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('does not match plain k without modifier', () => {
    const ev = { key: 'k', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(false)
  })
})
