<script setup>
defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="hot-list">
    <div class="section-header">
      <span class="s-label"><i class="fa-solid fa-chart-simple"></i> 热门文章</span>
    </div>
    <ul class="hot-items">
      <li
        v-for="(article, index) in articles"
        :key="article.id"
        class="hot-item"
      >
        <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
        <span class="title">{{ article.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hot-list {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 14px;
}

.section-header {
  margin-bottom: 12px;
}

.s-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--t3);
  display: flex;
  align-items: center;
  gap: 6px;
}
.s-label i { color: var(--accent); }

.hot-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity .2s;
}
.hot-item:hover { opacity: .7; }

.rank {
  font-size: 12px;
  font-weight: 800;
  color: var(--t3);
  min-width: 16px;
  text-align: center;
}
.rank.top {
  color: var(--accent);
}

.title {
  font-size: 12px;
  color: var(--t2);
  line-height: 1.4;
}
</style>