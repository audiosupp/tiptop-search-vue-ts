<template>
  <form @submit.prevent="handleSubmit" class="flex justify-center w-full mt-4 input-searchbar-wrapper">
    <div class="input-icon-wrapper">
      <InputText v-model="localQuery" placeholder="Поиск" :loading="loading" class="w-full" size="large"
        :disabled="loading" />

      <i v-if="!loading" class="pi pi-search search-icon"></i>
      <ProgressSpinner v-if="loading" class="spinner-icon" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue';
import { useTitle } from '@vueuse/core';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps<{
  loading: boolean;
  query: string;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const localQuery = ref(props.query);
useTitle(`${localQuery.value} - TipTop`);

watch(() => props.query, (newQuery) => {
  localQuery.value = newQuery;
});

const handleSubmit = async () => {
  if (localQuery.value.trim()) {
    emit('search', localQuery.value);
    useTitle(`${localQuery.value} - TipTop`);
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

.p-inputtext:focus {
  outline-offset: -2px !important;
}


.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.spinner-icon {
  width: 15px;
  height: 15px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>