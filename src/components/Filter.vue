<template>
  <div class="filter relative w-full">
    <i class="pi pi-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"></i>
    <InputText :value="inputValue" placeholder="Фильтр по названию или магазину" @input="handleInput"
      class="pl-10 w-full" size="large" />
  </div>

  <div class="shopButtons">
    <Button @click="clearFilter" :severity="selectedShops.length === 0 ? 'p-success' : 'secondary'" label="ВСЕ"
      :badge="totalProductCount.toString()" :badgeSeverity="selectedShops.length === 0 ? 'secondary' : 'p-success'"
      size="small" class="btn" raised />
    <Button v-for="shop in uniqueShops" :key="shop" @click="toggleShop(shop)"
      :severity="selectedShops.includes(shop) ? 'p-success' : 'secondary'" :label="shop"
      :badge="shopProductCounts[shop].toString()"
      :badgeSeverity="selectedShops.includes(shop) ? 'secondary' : 'p-success'" size="small" class="btn" raised />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps<{
  inputValue: string; // Prop for input value
  selectedShops: string[];
  uniqueShops: string[];
  totalProductCount: number;
  shopProductCounts: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: 'update:inputValue', value: string): void; // Emit event for v-model
  (e: 'update:selectedShops', shops: string[]): void; // Emit event for selected shops
}>();

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:inputValue', value); // Emit the new value to parent
};

const clearFilter = () => {
  emit('update:selectedShops', []); // Emit an empty array to clear selected shops
};

const toggleShop = (shop: string) => {
  const currentShops = [...props.selectedShops]; // Create a copy of the current selected shops
  const index = currentShops.indexOf(shop);

  if (index === -1) {
    currentShops.push(shop); // Add shop if not already selected
  } else {
    currentShops.splice(index, 1); // Remove shop if already selected
  }

  emit('update:selectedShops', currentShops); // Emit the updated list of selected shops
};
</script>

<style scoped>
.filter {
  margin-top: 10px;
  margin-bottom: 10px;
}

.p-inputtext {
  padding-left: 30px;
}

.pi-filter {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.shopButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>