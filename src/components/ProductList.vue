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

    <ImageModal :images="fetchedImages" :isVisible="isDialogVisible" @close="isDialogVisible = false"
      @update:visible="(event: boolean) => isDialogVisible = event" />

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
import ScrollTop from 'primevue/scrolltop';
import ScrollPanel from 'primevue/scrollpanel';
import ImageModal from './ImageModal.vue';
import ProgressSpinner from 'primevue/progressspinner';

interface Product {
  title: string;
  price: number;
  url: string;
  shop: string;
  image: string;
}

interface FetchedImage {
  url: string;
  productUrl: string;
  productTitle: string;
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

const fetchedImages = ref<FetchedImage[]>([]);
const loadingImage = ref(true);
const loadingImages = ref<Record<string, boolean>>({});
const loadingProduct = ref<Record<string, boolean>>({});

const onImageLoad = (url: string) => {
  loadingImages.value[url] = false;
};
const onImageError = (url: string) => {
  console.warn(`Failed to load image at ${url}`);
  loadingImages.value[url] = false;
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

  products.forEach(product => {
    loadingImages.value[product.image] = true;
  });

  return products;
});

const shopProductCounts = computed(() => {
  const counts: Record<string, number> = {};
  uniqueShops.value.forEach(shop => {
    counts[shop] = props.products.filter(product =>
      product.shop === shop &&
      product.title.toLowerCase().includes(inputValue.value.toLowerCase())
    ).length;
  });
  return counts;
});

watch(inputValue, (newValue) => {
  if (newValue.trim() === '') {
    totalProductCount.value = props.products.length;
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
  }).format(price).replace(/,/g, '.');
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

const fetchImagesForProduct = async (shop: string, url: string) => {
  try {
    const response = await axios.get(`/api/pictures?shop=${shop}&url=${url}`);

    if (Array.isArray(response.data) && response.data.length > 0) {
      fetchedImages.value = response.data.map(imageUrl => ({
        url: imageUrl,
        productUrl: url,
        productTitle: selectedProduct.value?.title || "Перейти на товар"
      }));
    } else {
      // If no images are found, use the main product image
      fetchedImages.value = [{
        url: selectedProduct.value?.image as string,
        productUrl: url,
        productTitle: selectedProduct.value?.title || "Перейти на товар"
      }];
    }
    console.log(fetchedImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    loadingImage.value = false;
  }
};

const showProductDetails = async (product: Product) => {
  loadingProduct.value[product.url] = true;
  selectedProduct.value = product;
  await fetchImagesForProduct(product.shop, product.url);
  loadingProduct.value[product.url] = false;
  isDialogVisible.value = true;
};
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