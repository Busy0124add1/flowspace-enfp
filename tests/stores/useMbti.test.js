import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMbti } from '@/stores/useMbti'

describe('useMbti store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.removeAttribute('data-mbti')
    document.documentElement.style.cssText = ''
  })

  it('defaults to ENFP when localStorage empty', () => {
    const store = useMbti()
    expect(store.code).toBe('ENFP')
  })

  it('loads saved code from localStorage', () => {
    localStorage.setItem('fs1_mbti', '"INTJ"')
    const store = useMbti()
    expect(store.code).toBe('INTJ')
  })

  it('current getter returns resolved config', () => {
    const store = useMbti()
    expect(store.current.accent).toBe('#f0537a')
    expect(store.current.name).toBe('竞选者')
  })

  it('setType persists and applies theme', () => {
    const store = useMbti()
    store.setType('INTJ')
    expect(store.code).toBe('INTJ')
    expect(localStorage.getItem('fs1_mbti')).toBe('"INTJ"')
    expect(document.documentElement.dataset.mbti).toBe('INTJ')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#9b6dff')
  })

  it('init applies theme from current code', () => {
    localStorage.setItem('fs1_mbti', '"ESFP"')
    const store = useMbti()
    store.init()
    expect(document.documentElement.dataset.mbti).toBe('ESFP')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#f5a623')
  })
})
