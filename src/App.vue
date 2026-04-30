<template>
  <div style="padding: 32px;">
    <h1>FlowSpace ENFP</h1>
    <p>MBTI: {{ mbti.code }} · {{ mbti.current.name }}</p>
    <div class="flex-row flex-gap-12" style="margin-top: 16px;">
      <AvatarBlock :type="mbti.current" :size="40" />
      <AvatarBlock :type="resolveType('INTJ')" :size="40" />
      <AvatarBlock :type="resolveType('ISFP')" :size="40" />
      <AvatarBlock :type="resolveType('ESTJ')" :size="40" />
    </div>
    <div style="margin-top: 16px;">
      <button @click="mbti.setType('INTJ')">切到 INTJ</button>
      <button @click="mbti.setType('ENFP')">切到 ENFP</button>
      <button @click="mbti.setType('ESFP')">切到 ESFP</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMbti } from '@/stores/useMbti'
import { resolveType } from '@/config/mbti'
import AvatarBlock from '@/components/mbti/AvatarBlock.vue'

const mbti = useMbti()
onMounted(() => mbti.init())
</script>
