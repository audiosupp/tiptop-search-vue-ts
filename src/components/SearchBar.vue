<template>
  <form @submit.prevent="handleSubmit" class="flex justify-center w-full mt-4 input-searchbar-wrapper">
    <div class="input-icon-wrapper">
      <InputText v-model="query" placeholder="Поиск" :loading="isLoading" class="w-full" />
      <i v-if="!isLoading" class="pi pi-search search-icon"></i>
      <ProgressSpinner v-else class="spinner-icon" />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTitle } from '@vueuse/core'
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const query = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (query.value.trim()) {
    isLoading.value = true;
    await emit('search', query.value);
    useTitle(`TipTop ${query.value}`);
    isLoading.value = false;
  }
};

</script>

<style scoped>
.input-icon-wrapper {
  position: relative;
  width: 100%;
}

.input-icon-wrapper .p-inputtext {
  padding-left: 30px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>
