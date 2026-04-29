<script setup>
import ArticleCard from './ArticleCard.vue'

defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

defineEmits(['article-click'])
</script>

<template>
  <div class="featured-articles">
    <div class="section-header">
      <span class="s-label"><i class="fa-solid fa-fire-flame-curved"></i> 精选文章</span>
    </div>
    <div class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="$emit('article-click', article)"
      />
    </div>
  </div>
</template>

<style scoped>
.featured-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
</style>