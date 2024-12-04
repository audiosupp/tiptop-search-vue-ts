<template>

  <ScrollPanel>
    <div class="filter relative w-full">
      <i class="pi pi-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"></i>
      <InputText v-model="inputValue" placeholder="Фильтр по названию или магазину" @input="handleInput"
        class="pl-10 w-full" />
    </div>


    <div class="shopButtons">
      <Button @click="clearFilter" :severity="selectedShops.length === 0 ? 'p-success' : 'secondary'" label="ВСЕ"
        :badge="totalProductCount" badgeSeverity="p-info" />
      <Button v-for="shop in uniqueShops" :key="shop" @click="toggleShop(shop)"
        :severity="selectedShops.includes(shop) ? 'p-success' : 'secondary'" :label="shop"
        :badge="shopProductCounts[shop]" badgeSeverity="p-info" />
    </div>

    <DataTable :value="filteredProducts" :loading="loading" rowKey="url" :scrollable="true" class="p-component">
      <Column field="image" header="">
        <template #body="{ data }">
          <img :src="data.image" alt="картинка продукта" class="tableImages" @click="showProductDetails(data)" />
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
        <template #body="{ data }">
          {{ data.price }} MDL
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="isDialogVisible" header="" :modal="true" :closable="true">
      <div class="image-container">
        <img :src="selectedProduct?.image" alt="" class="modal-image" />
      </div>
      <p>{{ selectedProduct?.title }}</p>
      <p>{{ selectedProduct?.price }} MDL</p>
      <a :href="selectedProduct?.url" target="_blank">Перейти</a>
    </Dialog>


    <ScrollTop target="parent" :threshold="20" icon="pi pi-arrow-up"
      :buttonProps="{ severity: 'contrast', raised: true, rounded: true }" />
  </ScrollPanel>

</template>

<script lang="ts" setup>
import { defineProps, ref, computed, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import ScrollTop from 'primevue/scrolltop';
import ScrollPanel from 'primevue/scrollpanel';

interface Product {
  title: string;
  price: number;
  url: string;
  shop: string;
  image: string;
}

const props = defineProps<{
  products: Product[];
}>();

const loading = ref(false);
const inputValue = ref('');
const selectedShops = ref<string[]>([]);
const isDialogVisible = ref(false);
const selectedProduct = ref<Product | null>(null);

// Unique shops computed property
const uniqueShops = computed(() => {
  const shops = new Set(props.products.map(product => product.shop));
  return Array.from(shops);
});

// Computed property for filtered products based on search query and selected shops
// const filteredProducts = computed(() => {
//   // If no shops are selected and input is empty, show all products
//   if (selectedShops.value.length === 0 && inputValue.value.trim() === '') {
//     return props.products; // Show all products
//   }

//   return props.products.filter(product => {
//     const matchesShop = selectedShops.value.length === 0 || selectedShops.value.includes(product.shop);
//     const matchesSearch = product.title.toLowerCase().includes(inputValue.value.toLowerCase()) ||
//       product.shop.toLowerCase().includes(inputValue.value.toLowerCase());
//     return matchesShop && matchesSearch;
//   });
// });


const filteredProducts = computed(() => {
  return props.products.filter(product => {
    const matchesShop = selectedShops.value.length === 0 || selectedShops.value.includes(product.shop);
    const matchesSearch = product.title.toLowerCase().includes(inputValue.value.toLowerCase()) ||
      product.shop.toLowerCase().includes(inputValue.value.toLowerCase());
    return matchesShop && matchesSearch;
  });
});

const shopProductCounts = computed(() => {
  const counts: Record<string, number> = {};
  uniqueShops.value.forEach(shop => {
    // Count products that match both the shop and the input value
    counts[shop] = props.products.filter(product =>
      product.shop === shop &&
      product.title.toLowerCase().includes(inputValue.value.toLowerCase())
    ).length;
  });
  return counts;
});

// const totalProductCount = computed(() => {
//   return filteredProducts.value.length;
// });

// const totalProductCount = computed(() => {
//   // Always return the total count of all products
//   return props.products.length; // This shows the total number of products available
// });

// Reactive variable to hold the last known total product count
const totalProductCount = ref(props.products.length);

// Watch for changes in inputValue to update totalProductCount
// watch(inputValue, (newValue) => {
//   if (newValue.trim() === '') {
//     totalProductCount.value = props.products.length; // Show all products if input is empty
//   } else {
//     totalProductCount.value = filteredProducts.value.length; // Show filtered count based on input
//   }
// });

watch(inputValue, (newValue) => {
  if (newValue.trim() === '') {
    // If input is empty, show all products
    totalProductCount.value = props.products.length; // Show total number of products
  } else {
    // Show filtered count based on input value only
    totalProductCount.value = props.products.filter(product =>
      product.title.toLowerCase().includes(newValue.toLowerCase()) ||
      product.shop.toLowerCase().includes(newValue.toLowerCase())
    ).length;
  }
});

// watch(selectedShops, () => {
//   // Recalculate totalProductCount based on current input value and selected shops
//   if (inputValue.value.trim() === '') {
//     totalProductCount.value = props.products.length; // Show total number of products
//   } else {
//     // Count filtered products based on input value and selected shops
//     const matchingFilteredProducts = filteredProducts.value;
//     totalProductCount.value = matchingFilteredProducts.length; // Show filtered count based on input
//   }
// });

// Method to handle input changes
const handleInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;
};

// Method to toggle shop selection
const toggleShop = (shop: string) => {
  const index = selectedShops.value.indexOf(shop);
  if (index === -1) {
    selectedShops.value.push(shop);
  } else {
    selectedShops.value.splice(index, 1);
  }
};

// Method to clear the filter and show all products
const clearFilter = () => {
  selectedShops.value = []; // Clear selected shops
};

/// Method to show product details in dialog
const showProductDetails = (product: Product) => {
  selectedProduct.value = product;
  isDialogVisible.value = true;
};
</script>

<style scoped>
.tableImages {
  width: 65px;
  height: 65px;
  cursor: pointer;
}

.image-container {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.filter {
  margin-top: 10px;
  margin-bottom: 10px;
}

.relative {
  position: relative;
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