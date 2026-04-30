<template>
  <section class="panel" v-if="project">
    <h3 class="panel-title">
      <i class="fa-solid fa-route" />
      设计流程 · {{ project.name }}
    </h3>
    <div class="flow">
      <div
        v-for="(name, i) in project.stages"
        :key="i"
        class="stage"
        :class="{ active: i === project.stage, done: i < project.stage }"
        @click="advance(i, $event)"
      >
        <div class="stage-dot">
          <i v-if="i < project.stage" class="fa-solid fa-check" />
          <span v-else>{{ i + 1 }}</span>
        </div>
        <div class="stage-name">{{ name }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()
const project = computed(() => ws.projects[0])
const emit = defineEmits(['stage-advance'])

function advance(targetIndex, event) {
  if (!project.value) return
  if (targetIndex <= project.value.stage) return
  if (targetIndex !== project.value.stage + 1) return
  ws.advanceProject(project.value.id)
  emit('stage-advance', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
}
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.flow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
  position: relative;
}
.flow::before {
  content: '';
  position: absolute;
  top: 11px;
  left: 8%;
  right: 8%;
  height: 2px;
  background: var(--line);
  z-index: 0;
}
.stage {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-width: 0;
}
.stage-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
  transition: all 0.2s;
}
.stage.active .stage-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}
.stage.done .stage-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.stage-name {
  font-size: 10.5px;
  color: var(--t3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.stage.active .stage-name { color: var(--t1); font-weight: 700; }
.stage.done .stage-name { color: var(--t2); }
</style>
