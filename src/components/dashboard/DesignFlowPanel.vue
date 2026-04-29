<script setup>
import { useDesignFlowStore } from '@/stores/designFlow'

const flow = useDesignFlowStore()

function setActive(index) {
  flow.setActive(index)
}
</script>

<template>
  <div class="design-card">
    <div class="design-card-head">
      <div>
        <div class="design-project-name">{{ flow.project.name }}</div>
        <div class="design-project-sub">Deadline: {{ flow.project.deadline }}</div>
      </div>
    </div>
    <div class="flow-stages">
      <div
        v-for="(stage, idx) in flow.stages"
        :key="stage.id"
        class="flow-stage"
        :class="{ done: stage.done, active: stage.active }"
        @click="setActive(idx)"
      >
        <div class="stage-node">
          <i :class="['fa-solid', stage.ico]"></i>
        </div>
        <div class="stage-lbl">{{ stage.lbl }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.design-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px 20px;
}
.design-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.design-project-name {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
  color: var(--t1);
}
.design-project-sub {
  font-size: 11px;
  color: var(--t3);
}
.flow-stages {
  display: flex;
  align-items: flex-start;
  position: relative;
}
.flow-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  position: relative;
}
.flow-stage::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  right: -50%;
  height: 2px;
  background: var(--line);
  z-index: 0;
  transition: background .3s;
}
.flow-stage:last-child::after { display: none; }
.flow-stage.done::after { background: var(--accent); }
.stage-node {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--surf);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--t3);
  transition: all .25s cubic-bezier(.25, 1, .5, 1);
  position: relative;
  z-index: 1;
}
.flow-stage:hover .stage-node {
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.1);
}
.flow-stage.done .stage-node {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  border-color: var(--accent);
  color: var(--accent);
}
.flow-stage.active .stage-node {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 60%, transparent);
}
.stage-lbl {
  font-size: 10px;
  color: var(--t3);
  text-align: center;
  line-height: 1.3;
  max-width: 52px;
  transition: color .2s;
}
.flow-stage.done .stage-lbl,
.flow-stage.active .stage-lbl { color: var(--t2); }
</style>
