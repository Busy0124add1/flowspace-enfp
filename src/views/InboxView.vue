<template>
  <InboxBoard />
</template>

<script setup>
import { onMounted } from 'vue'
import InboxBoard from '@/components/inbox/InboxBoard.vue'
import { useInbox } from '@/stores/useInbox'
import { useWorkspace } from '@/stores/useWorkspace'

const inbox = useInbox()
const ws = useWorkspace()

onMounted(async () => {
  await ws.hydrate()  // 确保 seed 被加载到 workspace
  inbox.hydrate()
  // 若 inbox 为空，从 seed 注入
  if (inbox.items.length === 0 && ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
})
</script>
