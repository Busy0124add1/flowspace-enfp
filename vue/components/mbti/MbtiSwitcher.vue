<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAppStore } from '@/stores/app'
import { MBTI_GROUPS } from '@/config/mbti.config'

const appStore = useAppStore()

const allTypes = Object.keys(appStore.allTypes)

// Group types by their MBTI group
const groupedTypesByGroup = {
  analysts: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  diplomats: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  sentinels: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  explorers: ['ISTP', 'ISFP', 'ESTP', 'ESFP']
}

function handleSelect(type) {
  appStore.setMbti(type)
}
</script>

<template>
  <Menu as="div" class="mbti-switcher">
    <MenuButton class="mbti-button">
      <span class="mbti-icon">
        <i class="fa-solid fa-user"></i>
      </span>
      <span class="mbti-type">{{ appStore.currentMbti }}</span>
      <i class="fa-solid fa-chevron-down mbti-arrow"></i>
    </MenuButton>

    <transition
      enter-active-class="dropdown-enter-active"
      enter-from-class="dropdown-enter-from"
      leave-active-class="dropdown-leave-active"
      leave-to-class="dropdown-leave-to"
    >
      <MenuItems class="mbti-menu">
        <div v-for="(types, groupKey) in groupedTypesByGroup" :key="groupKey" class="mbti-group">
          <div class="mbti-group-header" :style="{ color: MBTI_GROUPS[groupKey].color }">
            {{ MBTI_GROUPS[groupKey].name }}
          </div>
          <MenuItem
            v-for="type in types"
            :key="type"
            v-slot="{ active }"
          >
            <button
              :class="['mbti-option', { active, selected: type === appStore.currentMbti }]"
              :style="{
                '--group-color': MBTI_GROUPS[groupKey].color,
                backgroundColor: active ? 'var(--card)' : 'transparent'
              }"
              @click="handleSelect(type)"
            >
              {{ type }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style scoped>
.mbti-switcher {
  position: relative;
}

.mbti-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  color: var(--t1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mbti-button:hover {
  border-color: var(--accent);
}

.mbti-icon {
  color: var(--accent);
}

.mbti-type {
  min-width: 40px;
}

.mbti-arrow {
  font-size: 10px;
  color: var(--t2);
  transition: transform 0.2s ease;
}

.mbti-button[data-headlessui-state="open"] .mbti-arrow {
  transform: rotate(180deg);
}

.mbti-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 180px;
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
  outline: none;
}

.mbti-group {
  margin-bottom: 12px;
}

.mbti-group:last-child {
  margin-bottom: 0;
}

.mbti-group-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  margin-bottom: 4px;
}

.mbti-option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--t1);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mbti-option.selected {
  color: var(--group-color);
  background: var(--card);
}

.mbti-option:hover {
  background: var(--card);
}

/* Transition animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>