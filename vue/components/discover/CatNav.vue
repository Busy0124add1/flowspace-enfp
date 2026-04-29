<script setup>
import { ref } from 'vue'

const categories = [
  { id: 'all', label: '全部', icon: 'fa-solid fa-border-all' },
  { id: 'mbti', label: 'MBTI', icon: 'fa-solid fa-user-astronaut' },
  { id: 'work', label: '职场', icon: 'fa-solid fa-briefcase' },
  { id: 'creative', label: '创意', icon: 'fa-solid fa-lightbulb' },
  { id: 'social', label: '人际', icon: 'fa-solid fa-people-group' },
  { id: 'growth', label: '成长', icon: 'fa-solid fa-seedling' }
]

const selected = ref('all')

function selectCategory(id) {
  selected.value = id
}
</script>

<template>
  <nav class="cat-nav">
    <div class="cat-nav-inner">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="cat-btn"
        :class="{ active: selected === cat.id }"
        @click="selectCategory(cat.id)"
      >
        <i :class="cat.icon"></i>
        <span>{{ cat.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.cat-nav {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}
.cat-nav::-webkit-scrollbar { display: none; }

.cat-nav-inner {
  display: flex;
  gap: 6px;
  min-width: max-content;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--t2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}
.cat-btn i { font-size: 12px; }

.cat-btn:hover {
  border-color: var(--t3);
  color: var(--t1);
}

.cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
</style>