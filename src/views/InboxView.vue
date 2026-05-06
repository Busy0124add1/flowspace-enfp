<template>
  <div class="inbox-test">
    <h2>灵感收件箱（Task 27 card 目测）</h2>
    <button @click="addOne">加一条</button>
    <button @click="loadSeed">注入 seed 数据</button>
    <div class="card-demo">
      <InboxCard
        v-for="it in inbox.items"
        :key="it.id"
        :item="it"
        :selected="inbox.selectedIds.includes(it.id)"
        @select="(id, v) => { v ? inbox.selectedIds.push(id) : inbox.toggleSelect(id) }"
        @open="(id) => console.log('open', id)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInbox } from '@/stores/useInbox'
import { useWorkspace } from '@/stores/useWorkspace'
import InboxCard from '@/components/inbox/InboxCard.vue'

const inbox = useInbox()
const ws = useWorkspace()

onMounted(() => inbox.hydrate())

function addOne() {
  inbox.addItem({
    content: '测试灵感 ' + new Date().toLocaleTimeString() + ' https://v.douyin.com/example/',
  })
}

function loadSeed() {
  if (ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
}
</script>

<style scoped>
.inbox-test { padding: 24px; }
.card-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-top: 20px;
}
</style>
