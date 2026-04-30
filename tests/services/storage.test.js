import { describe, it, expect, beforeEach } from 'vitest'
import { load, save, remove } from '@/services/storage'

describe('storage service', () => {
  beforeEach(() => localStorage.clear())

  it('save + load round-trip', () => {
    save('test_key', { a: 1, b: [2, 3] })
    expect(load('test_key')).toEqual({ a: 1, b: [2, 3] })
  })

  it('load returns fallback when missing', () => {
    expect(load('missing', { x: 'default' })).toEqual({ x: 'default' })
  })

  it('load returns undefined when missing and no fallback', () => {
    expect(load('missing')).toBeUndefined()
  })

  it('load swallows JSON parse errors and returns fallback', () => {
    localStorage.setItem('broken', 'not-json{')
    expect(load('broken', 'safe')).toBe('safe')
  })

  it('remove clears the key', () => {
    save('tmp', 1)
    remove('tmp')
    expect(load('tmp')).toBeUndefined()
  })

  it('keys are automatically fs1_ prefixed', () => {
    save('foo', 'bar')
    expect(localStorage.getItem('fs1_foo')).toBe('"bar"')
  })
})
