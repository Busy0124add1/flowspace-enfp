<template>
  <div class="app">
    <TopBar />
    <main class="main">
      <RouterView />
    </main>
    <QuickCaptureDialog v-model:open="captureOpen" />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import TopBar from '@/components/layout/TopBar.vue'
import QuickCaptureDialog from '@/components/inbox/QuickCaptureDialog.vue'
import { useMbti } from '@/stores/useMbti'
import { useWorkspace } from '@/stores/useWorkspace'
import { useInbox } from '@/stores/useInbox'
import { useHotkey } from '@/composables/useHotkey'

const mbti = useMbti()
const ws = useWorkspace()
const inbox = useInbox()
const captureOpen = ref(false)

onMounted(async () => {
  mbti.init()
  await ws.hydrate()
  inbox.hydrate()
  if (inbox.items.length === 0 && ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
})

useHotkey('mod+k', () => { captureOpen.value = true })

function onExternalOpen() { captureOpen.value = true }
onMounted(() => window.addEventListener('fs1:open-capture', onExternalOpen))
onBeforeUnmount(() => window.removeEventListener('fs1:open-capture', onExternalOpen))
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.main { overflow: auto; }
</style>

<style>
:deep(.p-toast) { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
:deep(.p-toast-message) {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 14px;
  color: var(--t1);
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
</style>
