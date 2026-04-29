<script setup>
defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="tag-cloud">
    <div class="section-header">
      <span class="s-label"><i class="fa-solid fa-tags"></i> 标签云</span>
    </div>
    <div class="tags-wrap">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="cloud-tag"
        :style="{ fontSize: tag.size + 'px' }"
      >
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud {
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

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.cloud-tag {
  color: var(--t2);
  cursor: pointer;
  transition: color .2s;
}
.cloud-tag:hover {
  color: var(--accent);
}
</style>