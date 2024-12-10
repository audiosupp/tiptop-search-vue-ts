<template>
  <div>
    <Transition>
      <Search />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Search from './Search.vue';
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>