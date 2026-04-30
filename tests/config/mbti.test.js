import { describe, it, expect } from 'vitest'
import { MBTI_TYPES, MBTI_GROUPS, resolveType, DEFAULT_TYPE } from '@/config/mbti'

describe('MBTI config', () => {
  it('has all 16 types', () => {
    expect(Object.keys(MBTI_TYPES)).toHaveLength(16)
  })

  it('has 4 groups', () => {
    expect(Object.keys(MBTI_GROUPS)).toEqual(['analysts', 'diplomats', 'sentinels', 'explorers'])
  })

  it('every type belongs to a valid group', () => {
    for (const [code, t] of Object.entries(MBTI_TYPES)) {
      expect(MBTI_GROUPS[t.group], `${code} has invalid group`).toBeTruthy()
    }
  })

  it('DEFAULT_TYPE is ENFP', () => {
    expect(DEFAULT_TYPE).toBe('ENFP')
  })

  it('resolveType ENFP returns full config with particles and avatar', () => {
    const t = resolveType('ENFP')
    expect(t.code).toBe('ENFP')
    expect(t.accent).toBe('#f0537a')
    expect(t.avatar).toBe('/avatars/enfp.png')
    expect(t.particles.length).toBeGreaterThan(0)
    expect(t.groupMeta.label).toBe('外交家')
  })

  it('resolveType INTJ fills defaults for missing fields', () => {
    const t = resolveType('INTJ')
    expect(t.code).toBe('INTJ')
    expect(t.accent).toBe('#9b6dff')         // group 色 fallback
    expect(t.avatar).toBeNull()
    expect(t.particles.length).toBe(4)        // DEFAULT_PARTICLES
    expect(t.traits).toEqual(['I', 'N', 'T', 'J'])
  })

  it('resolveType unknown code falls back to ENFP', () => {
    const t = resolveType('ZZZZ')
    expect(t.code).toBe('ENFP')
  })
})
