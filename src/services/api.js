/**
 * API service layer - mock functions for future backend integration
 */

const API_BASE = '' // Will be configured when backend is ready

/**
 * Get MBTI configuration from server
 * @returns {Promise<Object>} MBTI config object
 */
export async function getMbtiConfig() {
  // TODO: Replace with actual API call when backend is ready
  // return fetch(`${API_BASE}/api/mbti/config`).then(r => r.json())
  return Promise.resolve({
    success: false,
    message: 'Backend not yet connected - using local config'
  })
}

/**
 * Update MBTI configuration on server
 * @param {Object} config - MBTI configuration to save
 * @returns {Promise<Object>} Update result
 */
export async function updateMbtiConfig(config) {
  // TODO: Replace with actual API call when backend is ready
  // return fetch(`${API_BASE}/api/mbti/config`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(config)
  // }).then(r => r.json())
  return Promise.resolve({
    success: false,
    message: 'Backend not yet connected - saved locally only'
  })
}

/**
 * Get threads from server
 * @returns {Promise<Array>} Threads array
 */
export async function getThreads() {
  return Promise.resolve({
    success: false,
    message: 'Backend not yet connected'
  })
}

/**
 * Get projects from server
 * @returns {Promise<Array>} Projects array
 */
export async function getProjects() {
  return Promise.resolve({
    success: false,
    message: 'Backend not yet connected'
  })
}
