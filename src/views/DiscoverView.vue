<script setup>
import { ref, computed } from 'vue'
import CatNav from '@/components/discover/CatNav.vue'
import FeaturedArticles from '@/components/discover/FeaturedArticles.vue'
import HotList from '@/components/discover/HotList.vue'
import TagCloud from '@/components/discover/TagCloud.vue'

const mockArticles = [
  {
    id: '1',
    title: 'ENFP 的创造力天赋：如何将灵感转化为行动',
    excerpt: '作为最具创意的 MBTI 类型之一，ENFP 常常面临灵感过多而执行力不足的困境。本文分享 5 个实用技巧，帮助你将脑中的灵感转化为实际成果。',
    author: '苏格拉底',
    views: 12840,
    category: 'mbti',
    tags: ['ENFP', '创造力', '自我成长']
  },
  {
    id: '2',
    title: '职场中内向者的生存之道',
    excerpt: '在以沟通为主导的现代职场，内向者常常被误解为不善于表达。其实，内向是一种力量，关键在于如何发挥自己的优势。',
    author: '林黛玉',
    views: 8920,
    category: 'work',
    tags: ['职场', '内向', '沟通']
  },
  {
    id: '3',
    title: '设计思维：从需求分析到原型的实战方法',
    excerpt: '设计思维是一种以人为中心的问题解决方法。本文通过实际案例，讲解如何从需求分析出发，一步步完成可落地的设计方案。',
    author: '达芬奇',
    views: 6540,
    category: 'creative',
    tags: ['设计', 'UX', '方法论']
  },
  {
    id: '4',
    title: '高情商沟通：化解冲突的心理学技巧',
    excerpt: '冲突是关系的试金石，也是成长的契机。掌握这些沟通技巧，让你在冲突中不仅能保护自己，还能增进彼此的理解。',
    author: '卡耐基',
    views: 11230,
    category: 'social',
    tags: ['沟通', '情商', '人际关系']
  },
  {
    id: '5',
    title: '持续成长：建立个人成长飞轮',
    excerpt: '个人成长不是一蹴而就，而是需要建立一套可持续的系统。本文介绍如何打造属于你自己的成长飞轮，实现持续进步。',
    author: '富兰克林',
    views: 9870,
    category: 'growth',
    tags: ['成长', '习惯', '方法论']
  },
  {
    id: '6',
    title: 'INTJ 性格解析：战略家的思维模式',
    excerpt: 'INTJ 是最罕见的 MBTI 类型之一，被称为"建筑师"或"战略家"。深入了解这种性格类型的思维模式和行为特征。',
    author: '爱因斯坦',
    views: 7650,
    category: 'mbti',
    tags: ['INTJ', 'MBTI', '性格解析']
  }
]

const mockTags = [
  { name: 'ENFP', size: 16 },
  { name: 'MBTI', size: 14 },
  { name: '职场', size: 15 },
  { name: '创意', size: 13 },
  { name: '成长', size: 14 },
  { name: '沟通', size: 12 },
  { name: '设计', size: 13 },
  { name: '心理学', size: 11 },
  { name: '人际关系', size: 12 },
  { name: '自我提升', size: 13 }
]

const selectedCategory = ref('all')

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') {
    return mockArticles
  }
  return mockArticles.filter(a => a.category === selectedCategory.value)
})

const hotArticles = computed(() => {
  return [...mockArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

function handleArticleClick(article) {
  console.log('Article clicked:', article.title)
}
</script>

<template>
  <div class="discover-view">
    <div class="discover-main">
      <CatNav />
      <div class="spacer"></div>
      <FeaturedArticles
        :articles="filteredArticles"
        @article-click="handleArticleClick"
      />
    </div>
    <aside class="discover-sidebar">
      <HotList :articles="hotArticles" />
      <div class="spacer"></div>
      <TagCloud :tags="mockTags" />
    </aside>
  </div>
</template>

<style scoped>
.discover-view {
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 18px;
  height: 100%;
  overflow: hidden;
}

.discover-main {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.discover-sidebar {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spacer { height: 4px; }

@media (max-width: 900px) {
  .discover-view {
    grid-template-columns: 1fr;
  }
  .discover-sidebar {
    display: none;
  }
}
</style>