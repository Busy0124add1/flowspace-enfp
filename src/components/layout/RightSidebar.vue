<template>
  <aside class="right-sidebar">
    <slot />
  </aside>
</template>

<script setup></script>

<style scoped>
.right-sidebar {
  background: var(--surf);
  border-left: 1px solid var(--line);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
