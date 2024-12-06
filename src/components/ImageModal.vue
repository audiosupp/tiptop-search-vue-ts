<template>
  <Dialog ref="maxDialog" :visible="isVisible" maximizable header="Title" class="w-full" @show="biggifyDialog">
    <div class="container p-8">
      <Carousel class="" :value="images" :numVisible="1" :responsiveOptions="responsiveOptions" circular>
        <template #item="{ data }">
          <div class="img-container p-36">
            <Image :src="data.url" :alt="data.productTitle" class="img" @click="$emit('close')" />
            <a :href="data.productUrl" class="img-link"><span class="mb-4 font-medium">{{ data.productTitle
                }}</span></a>
          </div>
        </template>
      </Carousel>
    </div>
  </Dialog>
</template>

<script lang='ts' setup>
import { defineProps, ref } from 'vue';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Carousel from 'primevue/carousel';


const maxDialog = ref<InstanceType<typeof Dialog> | any>(null);
// Function to maximize the dialog
function biggifyDialog() {
  if (maxDialog.value) {
    maxDialog.value.maximized = true;
  }
}

const displayBasic = ref(false);

interface FetchedImage {
  url: string;
  productUrl: string;
  productTitle: string;
}

const props = defineProps<{
  images: FetchedImage[];
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 1,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '1199px',
    numVisible: 1,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '575px',
    numVisible: 2,
    numScroll: 1,
    showNavigators: false
  }
]);
</script>

<style scoped>
.container {
  max-height: 80vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
  /* overflow: hidden; */
}

.img-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 80vh;
  max-width: 90vw;
  /* overflow: hidden; */
}

.img {
  max-width: 100%;
  max-height: 100%;
}

.img-link {
  position: absolute;
  bottom: 32px;
  font-size: 18px;
  text-align: center;
  display: block;
  width: 900px;
  line-break: strict;
}
</style>