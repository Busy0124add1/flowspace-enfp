import { defineStore } from 'pinia'

const STORAGE_KEY = 'fp3_energy'
const JOURNAL_KEY = 'fp3_journal'

const DEF_ENERGY = { mood: 80, focus: 65, creative: 90 }

function loadEnergy() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ? JSON.parse(v) : DEF_ENERGY
  } catch {
    return DEF_ENERGY
  }
}

function loadJournal() {
  try {
    return localStorage.getItem(JOURNAL_KEY) || ''
  } catch {
    return ''
  }
}

function saveEnergy(energy) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(energy))
  } catch {}
}

function saveJournal(text) {
  try {
    localStorage.setItem(JOURNAL_KEY, text)
  } catch {}
}

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    mood: loadEnergy().mood,
    focus: loadEnergy().focus,
    creative: loadEnergy().creative,
    journal: loadJournal()
  }),

  actions: {
    updateEnergy(key, value) {
      if (['mood', 'focus', 'creative'].includes(key)) {
        this[key] = value
        saveEnergy({ mood: this.mood, focus: this.focus, creative: this.creative })
      }
    },

    updateJournal(text) {
      this.journal = text
      saveJournal(text)
    },

    saveJournal() {
      saveJournal(this.journal)
    }
  }
})