<template>
  <div class="app">
    <nav class="temp-nav">
      <RouterLink to="/">工作台</RouterLink>
      <RouterLink to="/inbox">收件箱</RouterLink>
      <span class="spacer" />
      <span>MBTI: {{ mbti.code }}</span>
      <button @click="toggleMbti">切换</button>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useMbti } from '@/stores/useMbti'

const mbti = useMbti()
onMounted(() => mbti.init())

const order = ['ENFP', 'INTJ', 'ISFP', 'ESTJ']
function toggleMbti() {
  const i = order.indexOf(mbti.code)
  mbti.setType(order[(i + 1) % order.length])
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.temp-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: var(--surf);
  border-bottom: 1px solid var(--line);
}
.temp-nav a {
  color: var(--t2);
  padding: 4px 10px;
  border-radius: var(--r);
}
.temp-nav a.router-link-active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.spacer { flex: 1; }
.temp-nav button {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 4px 10px;
  border-radius: var(--r);
}
</style>
