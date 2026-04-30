export const MBTI_GROUPS = {
  analysts:  { label: '分析家', color: '#9b6dff' },
  diplomats: { label: '外交家', color: '#3ecfcf' },
  sentinels: { label: '守护者', color: '#4ade80' },
  explorers: { label: '探险家', color: '#f5a623' },
}

export const MBTI_TYPES = {
  ENFP: {
    code: 'ENFP', name: '竞选者', group: 'diplomats', accent: '#f0537a',
    description: '富有想象力的探索者',
    traits: ['E','N','F','P'],
    avatar: '/avatars/enfp.png',
    greeting: { morning: '早上好 ☀️', afternoon: '下午好 🌤️', evening: '晚上好 🌙' },
    particles: ['🥚','🌈','⭐','✨','💥','🎯','🔥','💫','🎉','🌟'],
  },
  INTJ: { code:'INTJ', name:'建筑师',    group:'analysts',  description:'战略性的思考者' },
  INTP: { code:'INTP', name:'逻辑学家',  group:'analysts',  description:'创新的发明家' },
  ENTJ: { code:'ENTJ', name:'指挥官',    group:'analysts',  description:'大胆的领导者' },
  ENTP: { code:'ENTP', name:'辩论家',    group:'analysts',  description:'机智的思考者' },
  INFJ: { code:'INFJ', name:'提倡者',    group:'diplomats', description:'安静的理想主义者' },
  INFP: { code:'INFP', name:'调停者',    group:'diplomats', description:'诗意的理想主义者' },
  ENFJ: { code:'ENFJ', name:'主人公',    group:'diplomats', description:'富有魅力的领导者' },
  ISTJ: { code:'ISTJ', name:'物流师',    group:'sentinels', description:'可靠的实干家' },
  ISFJ: { code:'ISFJ', name:'守卫者',    group:'sentinels', description:'温暖的守护者' },
  ESTJ: { code:'ESTJ', name:'总经理',    group:'sentinels', description:'高效的管理者' },
  ESFJ: { code:'ESFJ', name:'执政官',    group:'sentinels', description:'关怀的协调者' },
  ISTP: { code:'ISTP', name:'鉴赏家',    group:'explorers', description:'大胆的实验家' },
  ISFP: { code:'ISFP', name:'探险家',    group:'explorers', description:'灵活的艺术家' },
  ESTP: { code:'ESTP', name:'企业家',    group:'explorers', description:'精力充沛的行动派' },
  ESFP: { code:'ESFP', name:'表演者',    group:'explorers', description:'自发的享乐主义者' },
}

export const DEFAULT_TYPE = 'ENFP'
const DEFAULT_GREETING = { morning: '早上好', afternoon: '下午好', evening: '晚上好' }
const DEFAULT_PARTICLES = ['✨', '⭐', '💫', '🌟']

export function resolveType(code) {
  const t = MBTI_TYPES[code] || MBTI_TYPES[DEFAULT_TYPE]
  const group = MBTI_GROUPS[t.group]
  return {
    ...t,
    accent: t.accent ?? group.color,
    traits: t.traits ?? t.code.split(''),
    avatar: t.avatar ?? null,
    greeting: t.greeting ?? DEFAULT_GREETING,
    particles: t.particles ?? DEFAULT_PARTICLES,
    groupMeta: group,
  }
}
