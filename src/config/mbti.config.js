// MBTI Type Configuration
// Future expansion: Add other MBTI types here

export const MBTI_TYPES = {
  ENFP: {
    id: 'ENFP',
    group: 'diplomats',
    accent: '#f0537a',
    icon: '/icons/enfp-icon.png',
    avatar: {
      bounce: 'msc-bounce',
      celebrate: 'msc-celebrate',
      idle: 'msc-wobble',
      vibe: 'msc-vibe'
    },
    particles: ['🥚', '🌈', '⭐', '✨', '💥', '🎯', '🔥', '💫', '🎉', '🌟'],
    greeting: {
      morning: '早上好 ☀️',
      afternoon: '下午好 🌤️',
      evening: '晚上好 🌙'
    },
    description: '竞选者 · 富有想象力',
    traits: ['外向', '直觉', '情感', '知觉']
  }
  // Future: Add other types here
  // INTJ: { ... },
  // INFJ: { ... },
}

export const MBTI_GROUPS = {
  analysts: { name: '分析家', color: '#9b6dff' },
  diplomats: { name: '外交家', color: '#3ecfcf' },
  sentinels: { name: '守护者', color: '#4ade80' },
  explorers: { name: '探险家', color: '#f5a623' }
}

export const DEFAULT_TYPE = 'ENFP'