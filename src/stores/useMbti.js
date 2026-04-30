import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'
import { resolveType, DEFAULT_TYPE } from '@/config/mbti'

function applyTheme(type) {
  const root = document.documentElement
  root.dataset.mbti = type.code
  root.style.setProperty('--accent', type.accent)
  root.style.setProperty('--group-color', type.groupMeta.color)
}

export const useMbti = defineStore('mbti', {
  state: () => ({
    code: load('mbti', DEFAULT_TYPE),
  }),
  getters: {
    current: (s) => resolveType(s.code),
  },
  actions: {
    setType(code) {
      this.code = code
      save('mbti', code)
      applyTheme(resolveType(code))
    },
    init() {
      applyTheme(resolveType(this.code))
    },
  },
})
