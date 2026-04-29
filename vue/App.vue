<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Topbar from '@/components/layout/Topbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.applyCssVars()
})
</script>

<template>
  <div id="app">
    <Topbar />
    <div class="app-body">
      <main class="main-content">
        <router-view />
      </main>
      <Sidebar />
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}
</style>
