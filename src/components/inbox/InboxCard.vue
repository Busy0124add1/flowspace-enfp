<template>
  <article
    class="ic-card"
    :class="{ 'is-selected': selected, 'is-dragging': dragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click.self="$emit('open', item.id)"
  >
    <div class="ic-head">
      <Checkbox
        :model-value="selected"
        binary
        @update:model-value="(v) => $emit('select', item.id, v)"
        @click.stop
        :pt="{ root: 'ic-check', box: 'ic-check-box' }"
      />
      <div class="ic-excerpt" @click="$emit('open', item.id)">{{ item.content }}</div>
    </div>

    <a
      v-if="item.url"
      class="ic-url"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop
    >
      <i class="fa-solid fa-link" />
      <span>{{ domain }}</span>
    </a>

    <div class="ic-meta">
      <span class="ic-time">{{ timeAgo(item.createdAt) }}</span>
      <span v-for="t in item.tags" :key="t" class="ic-tag">#{{ t }}</span>
      <span v-if="item.source" class="ic-source">{{ sourceLabel }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import { timeAgo } from '@/utils/time'

const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'open', 'drag-start', 'drag-end'])

const dragging = ref(false)

const domain = computed(() => {
  if (!props.item.url) return ''
  try {
    return new URL(props.item.url).hostname.replace(/^www\./, '')
  } catch {
    return props.item.url
  }
})

const SOURCE_LABELS = {
  douyin: '抖音', zhihu: '知乎', xhs: '小红书',
  wechat: '微信', bilibili: 'B站', other: '其他',
}
const sourceLabel = computed(() => SOURCE_LABELS[props.item.source] || props.item.source)

function onDragStart(e) {
  dragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.item.id)
  emit('drag-start', props.item.id)
}
function onDragEnd() {
  dragging.value = false
  emit('drag-end', props.item.id)
}
</script>

<style scoped>
.ic-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 12px;
  cursor: grab;
  transition: border-color 0.15s, transform 0.15s, opacity 0.2s;
}
.ic-card:hover { border-color: var(--accent); }
.ic-card.is-selected { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent); }
.ic-card.is-dragging { opacity: 0.4; cursor: grabbing; }

.ic-head { display: flex; gap: 8px; align-items: flex-start; }
.ic-excerpt {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
  color: var(--t1);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  cursor: pointer;
}

.ic-url {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--accent);
  margin-top: 8px;
  text-decoration: none;
}
.ic-url:hover { text-decoration: underline; }

.ic-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 10.5px;
  color: var(--t3);
}
.ic-time { font-variant-numeric: tabular-nums; }
.ic-tag {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
.ic-source {
  color: var(--t2);
  font-weight: 600;
}
</style>

<style>
/* Checkbox pt class（非 scoped） */
.ic-check {
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-top: 2px;
}
.ic-check-box {
  width: 16px;
  height: 16px;
  background: var(--bg);
  border: 1.5px solid var(--line);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  color: transparent;
}
.ic-check-box[data-p-highlight="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.ic-check-box::after {
  content: '✓';
  font-size: 11px;
  font-weight: 700;
}
</style>
