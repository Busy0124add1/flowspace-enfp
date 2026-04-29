// MBTI Type Configuration
// All 16 MBTI types with group assignments and accent colors

export const MBTI_TYPES = {
  // Analysts
  INTJ: { id: 'INTJ', group: 'analysts', accent: '#9b6dff', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '直觉', '思维', '判断'] },
  INTP: { id: 'INTP', group: 'analysts', accent: '#9b6dff', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '直觉', '思维', '知觉'] },
  ENTJ: { id: 'ENTJ', group: 'analysts', accent: '#9b6dff', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '直觉', '思维', '判断'] },
  ENTP: { id: 'ENTP', group: 'analysts', accent: '#9b6dff', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '直觉', '思维', '知觉'] },
  // Diplomats
  INFJ: { id: 'INFJ', group: 'diplomats', accent: '#3ecfcf', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '直觉', '情感', '判断'] },
  INFP: { id: 'INFP', group: 'diplomats', accent: '#3ecfcf', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '直觉', '情感', '知觉'] },
  ENFJ: { id: 'ENFJ', group: 'diplomats', accent: '#3ecfcf', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '直觉', '情感', '判断'] },
  ENFP: {
    id: 'ENFP', group: 'diplomats', accent: '#f0537a',
    greeting: { morning: '早上好 ☀️', afternoon: '下午好 🌇', evening: '晚上好 🌙' },
    traits: ['外向', '直觉', '情感', '知觉'],
    description: '竞选者 · 富有想象力',
    particles: ['🥚', '🌈', '⭐', '✨', '💥', '🎯', '🔥', '💫', '🎉', '🌟']
  },
  // Sentinels
  ISTJ: { id: 'ISTJ', group: 'sentinels', accent: '#4ade80', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '感觉', '思维', '判断'] },
  ISFJ: { id: 'ISFJ', group: 'sentinels', accent: '#4ade80', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '感觉', '情感', '判断'] },
  ESTJ: { id: 'ESTJ', group: 'sentinels', accent: '#4ade80', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '感觉', '思维', '判断'] },
  ESFJ: { id: 'ESFJ', group: 'sentinels', accent: '#4ade80', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '感觉', '情感', '判断'] },
  // Explorers
  ISTP: { id: 'ISTP', group: 'explorers', accent: '#f5a623', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '感觉', '思维', '知觉'] },
  ISFP: { id: 'ISFP', group: 'explorers', accent: '#f5a623', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['内向', '感觉', '情感', '知觉'] },
  ESTP: { id: 'ESTP', group: 'explorers', accent: '#f5a623', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '感觉', '思维', '知觉'] },
  ESFP: { id: 'ESFP', group: 'explorers', accent: '#f5a623', greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' }, traits: ['外向', '感觉', '情感', '知觉'] }
}

export const MBTI_GROUPS = {
  analysts: { name: '分析家', color: '#9b6dff' },
  diplomats: { name: '外交家', color: '#3ecfcf' },
  sentinels: { name: '守护者', color: '#4ade80' },
  explorers: { name: '探险家', color: '#f5a623' }
}

export const DEFAULT_TYPE = 'ENFP'