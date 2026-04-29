// MBTI Type Configuration
// All 16 MBTI types with group assignments and accent colors

export const MBTI_TYPES = {
  // Analysts
  INTJ: { id: 'INTJ', group: 'analysts', accent: '#9b6dff' },
  INTP: { id: 'INTP', group: 'analysts', accent: '#9b6dff' },
  ENTJ: { id: 'ENTJ', group: 'analysts', accent: '#9b6dff' },
  ENTP: { id: 'ENTP', group: 'analysts', accent: '#9b6dff' },
  // Diplomats
  INFJ: { id: 'INFJ', group: 'diplomats', accent: '#3ecfcf' },
  INFP: { id: 'INFP', group: 'diplomats', accent: '#3ecfcf' },
  ENFJ: { id: 'ENFJ', group: 'diplomats', accent: '#3ecfcf' },
  ENFP: { id: 'ENFP', group: 'diplomats', accent: '#f0537a' },
  // Sentinels
  ISTJ: { id: 'ISTJ', group: 'sentinels', accent: '#4ade80' },
  ISFJ: { id: 'ISFJ', group: 'sentinels', accent: '#4ade80' },
  ESTJ: { id: 'ESTJ', group: 'sentinels', accent: '#4ade80' },
  ESFJ: { id: 'ESFJ', group: 'sentinels', accent: '#4ade80' },
  // Explorers
  ISTP: { id: 'ISTP', group: 'explorers', accent: '#f5a623' },
  ISFP: { id: 'ISFP', group: 'explorers', accent: '#f5a623' },
  ESTP: { id: 'ESTP', group: 'explorers', accent: '#f5a623' },
  ESFP: { id: 'ESFP', group: 'explorers', accent: '#f5a623' }
}

export const MBTI_GROUPS = {
  analysts: { name: '分析家', color: '#9b6dff' },
  diplomats: { name: '外交家', color: '#3ecfcf' },
  sentinels: { name: '守护者', color: '#4ade80' },
  explorers: { name: '探险家', color: '#f5a623' }
}

export const DEFAULT_TYPE = 'ENFP'