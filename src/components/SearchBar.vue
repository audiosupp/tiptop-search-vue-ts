<template>
  <form @submit.prevent="handleSubmit" class="flex justify-center w-full mt-4 input-searchbar-wrapper">
    <div class="input-icon-wrapper">
      <InputText v-model="query" placeholder="Поиск" :loading="isLoading" class="w-full" />
      <i class="pi pi-search search-icon"></i>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTitle } from '@vueuse/core'
import InputText from 'primevue/inputtext';

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const query = ref('');
const isLoading = ref(false);

const handleSubmit = () => {
  if (query.value.trim()) {
    emit('search', query.value);
    useTitle(`TipTop ${query.value}`);
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
