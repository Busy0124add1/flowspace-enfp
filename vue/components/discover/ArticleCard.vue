<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const categoryGradients = {
  mbti: 'linear-gradient(135deg, #9b6dff 0%, #6d4aff 100%)',
  work: 'linear-gradient(135deg, #3ecfcf 0%, #2aafaf 100%)',
  creative: 'linear-gradient(135deg, #f0537a 0%, #c73a5f 100%)',
  social: 'linear-gradient(135deg, #9de84b 0%, #7bc33a 100%)',
  growth: 'linear-gradient(135deg, #f5a623 0%, #d08a1a 100%)',
  default: 'linear-gradient(135deg, #252730 0%, #191b23 100%)'
}

function getGradient(category) {
  return categoryGradients[category] || categoryGradients.default
}
</script>

<template>
  <article class="article-card" @click="$emit('click', article)">
    <div class="card-cover" :style="{ background: getGradient(article.category) }">
      <div class="cover-overlay"></div>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="meta-author">{{ article.author }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-views"><i class="fa-solid fa-eye"></i> {{ article.views }}</span>
      </div>
      <h3 class="card-title">{{ article.title }}</h3>
      <p class="card-excerpt">{{ article.excerpt }}</p>
      <div class="card-tags" v-if="article.tags && article.tags.length">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow: hidden;
  cursor: pointer;
  transition: all .25s;
}
.article-card:hover {
  border-color: var(--t3);
  transform: translateY(-2px);
}

.card-cover {
  height: 100px;
  position: relative;
}
.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.2);
}

.card-body {
  padding: 14px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--t3);
  margin-bottom: 8px;
}
.meta-sep { opacity: .5; }
.meta-views i { margin-right: 3px; opacity: .7; }

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--t1);
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  font-size: 12px;
  color: var(--t2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tag {
  font-size: 10px;
  padding: 2px 8px;
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--t3);
}
</style>