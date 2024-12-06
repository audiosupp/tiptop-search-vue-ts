<template>

  <ScrollPanel>

    <div class="filter relative w-full">
      <i class="pi pi-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"></i>
      <InputText v-model="inputValue" placeholder="Фильтр по названию или магазину" @input="handleInput"
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

    <div>
      <DataTable v-if="filteredProducts.length > 0" :value="filteredProducts" :loading="loading" rowKey="url"
        :scrollable="true" class="p-component">
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
          <template #body="{ data }">
            <span class="font-bold">{{ formatPrice(data.price) }} MDL</span>
          </template>
        </Column>
      </DataTable>

      <div v-if="filteredProducts.length === 0" class="no-results">
        <i class="pi pi-times"></i>
        <p>Ничего не найдено.</p>
      </div>
    </div>


    <!-- <ProgressSpinner class="spinner-icon" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" /> -->
    <!-- <Dialog :visible="isDialogVisible" header="Product Images" :modal="true" :closable="true" :dismissableMask="true"
      @update:visible="$event => isDialogVisible = $event"> -->
    <ImageModal :images="fetchedImages" :isVisible="isDialogVisible" @close="isDialogVisible = false"
      @update:visible="$event => isDialogVisible = $event" />
    <!-- </Dialog> -->

    <ScrollTop target="parent" :threshold="20" icon="pi pi-arrow-up"
      :buttonProps="{ severity: 'contrast', raised: true, rounded: true }" />

  </ScrollPanel>

</template>

<script lang="ts" setup>
import axios from 'axios';
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import ScrollTop from 'primevue/scrolltop';
import ScrollPanel from 'primevue/scrollpanel';
import ImageModal from './ImageModal.vue';
import Galleria from 'primevue/galleria';
import ProgressSpinner from 'primevue/progressspinner';

import Image from 'primevue/image';


import { usePrimeVue } from "primevue/config";

const $primevue = usePrimeVue();
defineExpose({
  $primevue
})


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
const totalProductCount = ref(props.products.length);

const fetchedImages = ref<{ url: string }[]>([]);
const loadingImage = ref(true);
const loadingImages = ref<Record<string, boolean>>({});
const loadingProduct = ref<Record<string, boolean>>({});

const onImageLoad = (url: string) => {
  // Mark this image as loaded
  loadingImages.value[url] = false;
};
// Function to handle when an image fails to load
const onImageError = (url: string) => {
  // Optionally handle errors, e.g., set a default image or log
  console.warn(`Failed to load image at ${url}`);
  loadingImages.value[url] = false; // Set loading to false if there's an error
};

const emit = defineEmits<{
  (e: 'showModal', shop: string, url: string): void;
}>();


const uniqueShops = computed(() => {
  const shops = new Set(props.products.map(product => product.shop));
  return Array.from(shops);
});



const filteredProducts = computed(() => {
  const products = props.products.filter(product => {
    const matchesShop = selectedShops.value.length === 0 || selectedShops.value.includes(product.shop);
    const matchesSearch = product.title.toLowerCase().includes(inputValue.value.toLowerCase()) ||
      product.shop.toLowerCase().includes(inputValue.value.toLowerCase());
    return matchesShop && matchesSearch;
  });

  // Initialize loading states for images
  products.forEach(product => {
    loadingImages.value[product.image] = true; // Set all images to loading initially
  });

  return products;
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




watch(inputValue, (newValue) => {
  if (newValue.trim() === '') {
    totalProductCount.value = props.products.length; // Show total number of products
  } else {
    totalProductCount.value = props.products.filter(product =>
      product.title.toLowerCase().includes(newValue.toLowerCase()) ||
      product.shop.toLowerCase().includes(newValue.toLowerCase())
    ).length;
  }
});


const handleInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;
};


const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace(/,/g, '.'); // Replace commas with dots
};

const toggleShop = (shop: string) => {
  const index = selectedShops.value.indexOf(shop);
  if (index === -1) {
    selectedShops.value.push(shop);
  } else {
    selectedShops.value.splice(index, 1);
  }
};


const clearFilter = () => {
  selectedShops.value = [];
};

/// Method to fetch images for a specific product
/// Method to fetch images for a specific product
const fetchImagesForProduct = async (shop: string, url: string) => {
  try {
    const response = await axios.get(`/api/pictures?shop=${shop}&url=${url}`);
    //console.log('Fetched images:', response.data); // Debug log for fetched data

    // Check if response.data is an array and has images
    if (Array.isArray(response.data) && response.data.length > 0) {
      fetchedImages.value = response.data; // Use fetched images from API
    } else {
      // If no images are found, use the main product image
      fetchedImages.value = [selectedProduct.value?.image]; // Ensure it matches expected structure
      //console.warn('No images found for this product. Using main image instead.'); // Log warning
    }

    //console.log('Fetched Images State:', fetchedImages.value); // Debugging line

    // Set loadingImage to true and then set it to false after a delay
    loadingImage.value = true; // Start loading
    setTimeout(() => {
      loadingImage.value = false; // Stop loading after delay
    }, 1000); // Delay of 1 second

  } catch (error) {
    console.error('Error fetching images:', error);

    // If there's an error, stop loading immediately
    loadingImage.value = false;
  }
};

/// Method to show product details in dialog
// const showProductDetails = async (product: Product) => {
//   selectedProduct.value = product; // Set selected product
//   await fetchImagesForProduct(product.shop, product.url);
//   isDialogVisible.value = true; // Open dialog/modal only after fetching
// };

// Method to show product details in dialog
const showProductDetails = async (product: Product) => {
  // Set loading state for this product
  loadingProduct.value[product.url] = true; // Start loading

  selectedProduct.value = product; // Set selected product
  await fetchImagesForProduct(product.shop, product.url); // Fetch images for this product

  // After fetching images, reset loading state
  loadingProduct.value[product.url] = false; // Stop loading
  isDialogVisible.value = true; // Open dialog/modal only after fetching
};
</script>

<style scoped>
/* .image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
}

.tableImages {
  width: 3rem;
  height: auto;

}


.spinner-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.progress-spinner {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
  
 */

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

.no-results {
  text-align: center;
  margin-top: 6rem;
}
</style>