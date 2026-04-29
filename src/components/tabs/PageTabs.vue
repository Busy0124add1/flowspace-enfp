<script setup>
import { Tab, TabGroup, TabList } from '@headlessui/vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { name: '工作台', path: '/' },
  { name: '发现', path: '/discover' }
]

function handleTabChange(index) {
  router.push(tabs[index].path)
}
</script>

<template>
  <TabGroup :selectedIndex="tabs.findIndex(t => t.path === route.path)" @change="handleTabChange">
    <TabList class="page-tabs">
      <Tab
        v-for="tab in tabs"
        :key="tab.name"
        v-slot="{ selected }"
        class="page-tab"
      >
        <span :class="['tab-content', { selected }]">
          {{ tab.name }}
        </span>
      </Tab>
    </TabList>
  </TabGroup>
</template>

<style scoped>
.page-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg);
  border-radius: var(--r);
}

.page-tab {
  position: relative;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--t2);
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.page-tab:hover {
  color: var(--t1);
}

.page-tab:focus-visible {
  box-shadow: 0 0 0 2px var(--accent);
}

.tab-content {
  position: relative;
  z-index: 1;
}

.tab-content.selected {
  color: var(--t1);
}

.page-tab[data-headlessui-state="selected"] {
  background: var(--card);
  color: var(--t1);
}

.page-tab[data-headlessui-state="selected"] .tab-content {
  color: var(--t1);
}
</style>