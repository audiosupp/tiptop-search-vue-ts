<template>
  <ScrollPanel>
    <Filter :inputValue="inputValue" @update:inputValue="inputValue = $event" :selectedShops="selectedShops"
      :uniqueShops="uniqueShops" :totalProductCount="totalProductCount" :shopProductCounts="shopProductCounts"
      @update:selectedShops="selectedShops = $event" />

    <ProductTable :filteredProducts="filteredProducts" :loading="loading" :loadingProduct="loadingProduct"
      :showProductDetails="showProductDetails" :onImageLoad="onImageLoad" :onImageError="onImageError"
      :formatPrice="formatPrice" />

    <ImageModal :images="fetchedImages" :isVisible="isDialogVisible" @close="isDialogVisible = false"
      @update:visible="(event: boolean) => isDialogVisible = event" />

    <ScrollTop target="parent" :threshold="20" icon="pi pi-arrow-up"
      :buttonProps="{ severity: 'contrast', raised: true, rounded: true }" />
  </ScrollPanel>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { defineProps, ref, computed, watch } from 'vue';
import ScrollTop from 'primevue/scrolltop';
import ScrollPanel from 'primevue/scrollpanel';
import ImageModal from './ImageModal.vue';
import Filter from './Filter.vue';
import ProductTable from './ProductTable.vue';


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
  api_url: string;
}>();


const fetchedImages = ref<FetchedImage[]>([]);

const loading = ref(false);
const inputValue = ref('');
const selectedShops = ref<string[]>([]);
const isDialogVisible = ref(false);
const selectedProduct = ref<Product | null>(null);
const totalProductCount = ref(props.products.length);


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

// const emit = defineEmits<{
//   (e: 'showModal', shop: string, url: string): void;
// }>();


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




const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace(/,/g, '.');
};


const fetchImagesForProduct = async (shop: string, url: string) => {
  try {
    const response = await axios.get(`${props.api_url}/api/pictures?shop=${shop}&url=${url}`);

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

<style scoped></style>