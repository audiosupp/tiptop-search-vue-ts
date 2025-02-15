<template>
  <ScrollPanel class="flex flex-col items-center bg-gray-100 min-h-screen">
    <div v-if="!hasSearched" class="mt-36 flex flex-col items-center">
      <img src="/src/assets/logo.png" alt="TipTop logo" class="mb-2 w-24" />
      <h1 class="text-lg font-semibold">TipTop</h1>
    </div>
    <Transition>
      <div class="w-full p-4 overflow-auto max-h-screen scrollbar-hide">
        <div :class="['flex justify-center', !hasSearched ? 'w-2/3 mx-auto' : 'w-full']" id="searchBarDiv">
          <SearchBar :loading="loading" :query="query" @search="fetchProducts" />
        </div>

        <Transition>
          <ProductList v-if="!loading && products.length > 0" :products="products" :api_url="API_URL" />
        </Transition>

        <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
        <div v-if="!loading && hasSearched && products.length === 0" class="text-center">Ничего не найдено.</div>

        <ScrollTop target="parent" :threshold="20" icon="pi pi-arrow-up"
          :buttonProps="{ severity: 'green', raised: true, rounded: true }" />
      </div>
    </Transition>
  </ScrollPanel>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';
import ProductList from './ProductList.vue';
import axios from 'axios';
import ScrollTop from 'primevue/scrolltop';
import ScrollPanel from 'primevue/scrollpanel';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref<string | null>(null);
const query = ref('');
const hasSearched = ref(false);
const API_URL = import.meta.env.VITE_API_URL;


const fetchProducts = async (query: string) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`);
    products.value = response.data;
    router.push({ path: '/search', query: { query } });
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const initializeQuery = async () => {
  if (route.query.query) {
    query.value = route.query.query as string;
    await fetchProducts(query.value);
    hasSearched.value = true;
  }
};

onMounted(() => {
  initializeQuery();
});

watch(() => route.query.query, async (newQuery) => {
  if (newQuery) {
    query.value = newQuery as string;
    await fetchProducts(newQuery as string);
    await nextTick(() => {
      hasSearched.value = true;
    });
  }
});

</script>

<style scoped>
.text-center {
  margin: 20px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>