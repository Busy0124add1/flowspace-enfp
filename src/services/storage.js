/**
 * Storage utility - localStorage wrapper with fp3_ prefix
 */

const PREFIX = 'fp3_'

/**
 * Load value from localStorage
 * @param {string} key - Storage key (without prefix)
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function load(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (e) {
    return defaultValue
  }
}

/**
 * Save value to localStorage
 * @param {string} key - Storage key (without prefix)
 * @param {*} value - Value to save
 */
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    // Swallow error (quota exceeded, private mode, etc.)
  }
}
