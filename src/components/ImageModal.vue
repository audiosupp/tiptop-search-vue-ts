<template>
  <Dialog ref="maxDialog" :visible="isVisible" maximizable header="Title" class="w-full" @show="biggifyDialog">
    <div class="container">
      <Carousel class="" :value="images" :numVisible="1" :responsiveOptions="responsiveOptions" circular>
        <template #item="{ data }">
          <div class="flex flex-col justify-center items-center">
            <div class="img-container min-h-screen max-h-screen object-cover size-6/12">
              <Image :src="data.url" :alt="data.productTitle" class="img object-scale-down size-fit"
                @click="$emit('close')" />
            </div>
            <div> <a :href="data.productUrl" class="img-link underline"><span class="mb-4 font-bold">{{
              data.productTitle
                  }}</span></a></div>
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
  max-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  /* overflow: hidden; */
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* .img {
  width: 50%;
  max-width: 90%;
  max-height: calc(100vh - 255px);
} */

.img-link {
  position: absolute;
  bottom: 0px;
  font-size: 18px;
  text-align: center;
  display: block;
  width: 900px;
  padding: 10px;
  margin-left: -450px;
  background-color: #fff;
}
</style>