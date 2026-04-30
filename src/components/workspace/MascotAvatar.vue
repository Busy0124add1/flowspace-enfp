<template>
  <div class="mascot-wrap">
    <div class="mascot-frame" :class="moodClass">
      <AvatarBlock :type="mbti.current" :size="96" />
    </div>
    <div class="mascot-meta">
      <div class="mascot-greeting">{{ greeting }}</div>
      <div class="mascot-name">{{ mbti.current.name }} · {{ mbti.current.description }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMbti } from '@/stores/useMbti'
import { useWorkspace } from '@/stores/useWorkspace'
import AvatarBlock from '@/components/mbti/AvatarBlock.vue'

const mbti = useMbti()
const ws = useWorkspace()

const greeting = computed(() => {
  const h = new Date().getHours()
  const slot = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  return mbti.current.greeting[slot]
})

// P8 会接 celebrate 事件切 msc-celebrate；本阶段只根据 mood 切默认 class
const moodClass = computed(() => {
  const m = ws.energy.mood
  if (m >= 75) return 'msc-bounce'
  if (m >= 45) return 'msc-vibe'
  return 'msc-wobble'
})
</script>

<style scoped>
.mascot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 4px;
  gap: 8px;
}
.mascot-frame {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}
.mascot-meta { text-align: center; }
.mascot-greeting {
  font-size: 14px;
  font-weight: 700;
  color: var(--t1);
}
.mascot-name {
  font-size: 11px;
  color: var(--t2);
  margin-top: 2px;
}

/* 四种情绪 class */
.msc-bounce { animation: msc-bounce 1.2s ease-in-out infinite; }
.msc-vibe { animation: msc-vibe 2.5s ease-in-out infinite; }
.msc-wobble { animation: msc-wobble 2s ease-in-out infinite; }
.msc-celebrate { animation: msc-celebrate 0.6s ease-out; }

@keyframes msc-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes msc-vibe {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}
@keyframes msc-wobble {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
}
@keyframes msc-celebrate {
  0% { transform: scale(1); }
  40% { transform: scale(1.15) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
}
</style>
