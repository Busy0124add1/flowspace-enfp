<template>
  <div class="daily-spark-wrap">
    <div class="spark-header">
      <i class="fa-solid fa-wand-magic-sparkles" />
      <span class="spark-label">今日灵感</span>
    </div>
    <div class="spark-text">{{ displayText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { SPARKS } from '@/config/sparks'
import { load, save } from '@/services/storage'

const displayText = ref('')
let timer = null

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

onMounted(() => {
  const record = load('daily_spark', null)
  let index
  if (record && record.date === todayKey()) {
    index = record.index
  } else {
    index = Math.floor(Math.random() * SPARKS.length)
    save('daily_spark', { date: todayKey(), index })
  }
  const full = SPARKS[index]
  let i = 0
  timer = setInterval(() => {
    displayText.value = full.slice(0, i)
    i++
    if (i > full.length) clearInterval(timer)
  }, 50)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.daily-spark-wrap {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent) 8%, transparent),
    color-mix(in srgb, var(--violet) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: var(--r2);
  padding: 18px 28px;         /* v2-4 加宽的 padding */
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}
.daily-spark-wrap::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--violet) 20%, transparent), transparent 70%);
  pointer-events: none;
}
.spark-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}
.spark-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--t1);
  line-height: 1.5;
  position: relative;
  z-index: 1;
  min-height: 24px;
}
</style>
