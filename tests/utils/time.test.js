import { describe, it, expect } from 'vitest'
import { timeAgo } from '@/utils/time'

describe('timeAgo', () => {
  const NOW = new Date('2026-04-30T12:00:00Z').getTime()

  it('< 1 minute returns 刚刚', () => {
    expect(timeAgo(NOW - 30 * 1000, NOW)).toBe('刚刚')
  })

  it('1-59 minutes returns Xm ago', () => {
    expect(timeAgo(NOW - 15 * 60 * 1000, NOW)).toBe('15m ago')
  })

  it('1-23 hours returns Xh ago', () => {
    expect(timeAgo(NOW - 3 * 60 * 60 * 1000, NOW)).toBe('3h ago')
  })

  it('1-6 days returns Xd ago', () => {
    expect(timeAgo(NOW - 2 * 24 * 60 * 60 * 1000, NOW)).toBe('2d ago')
  })

  it('>= 7 days returns YYYY-MM-DD', () => {
    const old = new Date('2026-04-15T10:00:00Z').getTime()
    expect(timeAgo(old, NOW)).toBe('2026-04-15')
  })

  it('future timestamp returns 刚刚', () => {
    expect(timeAgo(NOW + 10000, NOW)).toBe('刚刚')
  })
})
