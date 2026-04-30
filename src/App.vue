<template>
  <div class="app">
    <TopBar />
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
import { useMbti } from '@/stores/useMbti'

const mbti = useMbti()
onMounted(() => mbti.init())
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.main { overflow: auto; }
</style>
