import { defineStore } from 'pinia'
import { MBTI_TYPES, MBTI_GROUPS, DEFAULT_TYPE } from '@/config/mbti.config'

const STORAGE_KEY = 'fp3_mbti'

// Load MBTI type from localStorage
function loadMbtiFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && MBTI_TYPES[stored]) {
      return stored
    }
  } catch (e) {
    // Swallow errors
  }
  return DEFAULT_TYPE
}

export const useAppStore = defineStore('app', {
  state: () => ({
    currentMbti: loadMbtiFromStorage(),
    remoteConfig: null
  }),

  getters: {
    mbtiConfig: (state) => {
      const localConfig = MBTI_TYPES[state.currentMbti] || MBTI_TYPES[DEFAULT_TYPE]
      // Remote config takes precedence if present
      if (state.remoteConfig) {
        return { ...localConfig, ...state.remoteConfig }
      }
      return localConfig
    },

    accentColor: (state) => {
      const config = state.remoteConfig
        ? { ...MBTI_TYPES[state.currentMbti], ...state.remoteConfig }
        : MBTI_TYPES[state.currentMbti]
      return config?.accent || MBTI_TYPES[DEFAULT_TYPE].accent
    },

    cssVars: (state) => {
      const config = state.remoteConfig
        ? { ...MBTI_TYPES[state.currentMbti], ...state.remoteConfig }
        : MBTI_TYPES[state.currentMbti]
      return {
        accent: config?.accent || MBTI_TYPES[DEFAULT_TYPE].accent
      }
    },

    allTypes: () => {
      return Object.keys(MBTI_TYPES)
    },

    mbtiGroup: (state) => {
      const config = MBTI_TYPES[state.currentMbti]
      return config ? MBTI_GROUPS[config.group] : null
    }
  },

  actions: {
    setMbti(type) {
      if (MBTI_TYPES[type]) {
        this.currentMbti = type
        localStorage.setItem(STORAGE_KEY, type)
        this.applyCssVars()
      }
    },

    applyCssVars() {
      const color = this.accentColor
      document.documentElement.style.setProperty('--accent', color)
    },

    loadRemoteConfig() {
      // Future: Load config from remote API
      // This is a placeholder for remote config loading
      // API would return config matching MBTI_TYPES structure
      this.remoteConfig = null
    }
  }
})