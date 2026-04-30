<template>
  <Select
    :model-value="mbti.code"
    :options="groupedOptions"
    option-label="label"
    option-value="value"
    option-group-label="groupLabel"
    option-group-children="items"
    placeholder="选择 MBTI"
    class="mbti-select"
    :pt="{ root: 'mbti-select-root', input: 'mbti-select-input', panel: 'mbti-select-panel' }"
    @update:model-value="onChange"
  >
    <template #value="{ value }">
      <span class="val">
        <AvatarBlock :type="mbti.current" :size="24" />
        <span class="val-text">
          <strong>{{ mbti.current.code }}</strong>
          <em>{{ mbti.current.name }}</em>
        </span>
      </span>
    </template>
    <template #optiongroup="{ option }">
      <div class="opt-group">
        <span class="opt-group-dot" :style="{ background: option.groupColor }" />
        {{ option.groupLabel }}
      </div>
    </template>
    <template #option="{ option }">
      <div class="opt">
        <span class="opt-dot" :style="{ background: option.accent }" />
        <strong>{{ option.value }}</strong>
        <span class="opt-name">{{ option.label.split(' · ')[1] }}</span>
        <span v-if="option.value === mbti.code" class="opt-check">✓</span>
      </div>
    </template>
  </Select>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import { useMbti } from '@/stores/useMbti'
import { MBTI_TYPES, MBTI_GROUPS, resolveType } from '@/config/mbti'
import AvatarBlock from './AvatarBlock.vue'

const mbti = useMbti()

const groupedOptions = computed(() => {
  const groups = {}
  for (const code of Object.keys(MBTI_TYPES)) {
    const t = resolveType(code)
    if (!groups[t.group]) {
      groups[t.group] = {
        groupLabel: MBTI_GROUPS[t.group].label,
        groupColor: MBTI_GROUPS[t.group].color,
        items: [],
      }
    }
    groups[t.group].items.push({
      value: code,
      label: `${t.code} · ${t.name}`,
      accent: t.accent,
    })
  }
  // 固定顺序：analysts / diplomats / sentinels / explorers
  return ['analysts', 'diplomats', 'sentinels', 'explorers']
    .map((g) => groups[g])
    .filter(Boolean)
})

function onChange(code) {
  mbti.setType(code)
}
</script>

<style scoped>
.mbti-select { min-width: 180px; }
.val { display: inline-flex; align-items: center; gap: 8px; }
.val-text { display: inline-flex; flex-direction: column; line-height: 1.15; }
.val-text strong { font-size: 13px; font-weight: 800; color: var(--t1); }
.val-text em { font-size: 11px; color: var(--t2); font-style: normal; }

.opt-group {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; font-size: 11px; font-weight: 700;
  color: var(--t3); text-transform: uppercase; letter-spacing: 0.6px;
  background: var(--bg);
}
.opt-group-dot { width: 8px; height: 8px; border-radius: 50%; }

.opt {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; cursor: pointer; font-size: 13px;
  color: var(--t1);
}
.opt:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.opt-dot { width: 10px; height: 10px; border-radius: 50%; }
.opt-name { color: var(--t2); font-size: 12px; }
.opt-check { margin-left: auto; color: var(--accent); font-weight: 800; }
</style>

<style>
/* Select 的 panel 被 portal 到 body，作为非 scoped 的全局样式 */
.mbti-select-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 240px;
  max-height: 400px;
  overflow-y: auto;
}
.mbti-select-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.15s;
}
.mbti-select-root:hover { border-color: var(--accent); }
.mbti-select-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  flex: 1;
}
</style>
