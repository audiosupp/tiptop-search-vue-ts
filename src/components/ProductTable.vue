<template>
  <div class="scroll-container">
    <DataTable v-if="filteredProducts.length > 0" :value="filteredProducts" :loading="loading" rowKey="url"
      class="p-component" :metaKeySelection=false :scrollable="true">
      <Column field="image" header="">
        <template #body="{ data }">
          <div class="image-container">
            <img v-if="!loadingProduct[data.url]" :src="data.image" alt="картинка продукта" class="tableImages"
              @click="showProductDetails(data)" @load="onImageLoad(data.image)" @error="onImageError(data.image)"
              style="cursor: pointer;" />
            <ProgressSpinner v-if="loadingProduct[data.url]" strokeWidth="3" fill="transparent" animationDuration="1s"
              aria-label="Loading" class="spinner" />
          </div>
        </template>
      </Column>

      <Column field="title" header="НАИМЕНОВАНИЕ" sortable />

      <Column field="shop" header="" />

      <Column field="url" header="">
        <template #body="{ data }">
          <a :href="data.url" target="_blank" rel="noopener noreferrer">Перейти</a>
        </template>
      </Column>

      <Column field="price" header="ЦЕНА" sortable>
        <template #body="{ data }" class="">
          <span class="font-bold price-inline whitespace-nowrap">{{ formatPrice(data.price) }} MDL</span>
        </template>
      </Column>
    </DataTable>
    <div v-if="filteredProducts.length === 0" class="no-results">
      <i class="pi pi-times"></i>
      <p>Ничего не найдено.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

interface Product {
  title: string;
  price: number;
  url: string;
  shop: string;
  image: string;
}

const props = defineProps<{
  filteredProducts: Product[];
  loading: boolean;
  loadingProduct: Record<string, boolean>;
  showProductDetails: (product: Product) => void;
  onImageLoad: (url: string) => void;
  onImageError: (url: string) => void;
  formatPrice: (price: number) => string;
}>();
</script>

<style scoped>
.image-container {
  position: relative;
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.tableImages {
  max-width: 100%;
  max-height: 100%;
}

.spinner {
  position: absolute;
  width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.progress-spinner:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.53);
}

.no-results {
  text-align: center;
  margin-top: 6rem;
}
</style>