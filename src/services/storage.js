const PREFIX = 'fs1_'

export function load(key, fallback = undefined) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('[storage] save failed', key, e)
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}
