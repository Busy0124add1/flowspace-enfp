import { onMounted, onBeforeUnmount } from 'vue'

export function matchHotkey(event, pattern) {
  const parts = pattern.toLowerCase().split('+')
  const keyPart = parts[parts.length - 1]
  const wantShift = parts.includes('shift')
  const wantAlt = parts.includes('alt')
  const wantMod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('meta')

  const hasMod = event.ctrlKey || event.metaKey
  if (wantMod !== hasMod) return false
  if (event.shiftKey !== wantShift) return false
  if (event.altKey !== wantAlt) return false
  if (String(event.key).toLowerCase() !== keyPart) return false
  return true
}

export function useHotkey(pattern, handler, options = {}) {
  const { preventDefault = true, stopPropagation = false } = options

  function onKey(ev) {
    if (!matchHotkey(ev, pattern)) return
    if (preventDefault) ev.preventDefault()
    if (stopPropagation) ev.stopPropagation()
    handler(ev)
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}
