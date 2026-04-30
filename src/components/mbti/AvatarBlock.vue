<template>
  <img
    v-if="showImage"
    :src="type.avatar"
    :alt="type.name"
    class="avatar"
    @error="imgFailed = true"
  />
  <div
    v-else
    class="avatar avatar-fallback"
    :style="{ background: type.accent }"
    :title="`${type.code} · ${type.name}`"
  >
    {{ type.code }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: { type: Object, required: true },  // resolveType 的结果
  size: { type: Number, default: 40 },
})

const imgFailed = ref(false)
const showImage = computed(() => !!props.type.avatar && !imgFailed.value)
</script>

<style scoped>
.avatar {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  border-radius: 10px;
  object-fit: cover;
  display: inline-block;
  vertical-align: middle;
}
.avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind('Math.round(props.size * 0.26) + "px"');
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
  user-select: none;
}
</style>
