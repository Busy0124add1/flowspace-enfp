<script setup>
import { ref, onMounted } from 'vue'

const SPARK_KEY_DATE = 'fp3_spark_date'
const SPARK_KEY_TEXT = 'fp3_spark_text'

const SPARKS = [
  '今天的你，比昨天更接近梦想',
  '创意是一场温柔的叛逆',
  '保持好奇，保持热爱',
  '每一个不曾起舞的日子，都是对生命的辜负',
  '简单的事情重复做，你就是专家',
  '勇敢不是不恐惧，而是心怀恐惧依然前行',
  '想象力比知识更重要',
  '做你热爱的事，热爱你做的事',
  '今天的目标是成为比昨天更好的自己',
  '生活的意义在于可能性',
  '不要等待机会，而要创造机会',
  '专注是通往卓越的唯一路径',
  '每一次失败都是通往成功的练习',
  '你比你想象的更强大',
  '今天的选择塑造明天的你',
  '保持热情，保持行动',
  'small steps lead to big changes',
  '相信过程，相信自己',
  '每一天都是新的开始',
  '做让自己骄傲的事',
]

const sparkText = ref('')
const displayText = ref('')
const isTyping = ref(false)

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function loadSpark() {
  const today = getToday()
  const storedDate = localStorage.getItem(SPARK_KEY_DATE)
  let text = localStorage.getItem(SPARK_KEY_TEXT)

  if (storedDate !== today || !text) {
    const idx = Math.floor(Math.random() * SPARKS.length)
    text = SPARKS[idx]
    localStorage.setItem(SPARK_KEY_DATE, today)
    localStorage.setItem(SPARK_KEY_TEXT, text)
  }

  sparkText.value = text
  startTypewriter(text)
}

let typewriterInterval = null

function startTypewriter(text) {
  displayText.value = ''
  isTyping.value = true
  let i = 0
  typewriterInterval = setInterval(() => {
    if (i < text.length) {
      displayText.value += text[i]
      i++
    } else {
      clearInterval(typewriterInterval)
      isTyping.value = false
    }
  }, 50)
}

onMounted(() => {
  loadSpark()
})

onUnmounted(() => {
  if (typewriterInterval) clearInterval(typewriterInterval)
})
</script>

<template>
  <div class="spark-line">
    <div class="spark-badge">
      <i class="fa-solid fa-bolt"></i>
      <span>每日灵感</span>
    </div>
    <div class="spark-text">{{ displayText }}<span v-if="isTyping" class="cursor">|</span></div>
  </div>
</template>

<style scoped>
.spark-line {
  background: linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--accent) 15%, var(--card)) 100%);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 14px 16px;
}

.spark-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 8px;
}

.spark-badge i {
  font-size: 9px;
}

.spark-text {
  font-size: 14px;
  color: var(--t1);
  line-height: 1.5;
  min-height: 42px;
}

.cursor {
  animation: blink 0.8s infinite;
  color: var(--accent);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>