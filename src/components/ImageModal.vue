<template class="overflow-hidden">
  <Dialog ref="maxDialog" :visible="isVisible" maximizable header="Title" class="flex h-screen w-full overflow-hidden "
    @show="biggifyDialog" @update:visible="handleVisibilityChange" :showHeader="false" :blockScroll="true" :minX="0"
    :minY="0" @hide="emit('close')">
    <div class="container flex h-screen w-full m-auto overflow-hidden ">
      <div class="m-auto flex flex-col justify-center ">
        <Carousel containerClass="overflow-hidden" :value="images" :numVisible="1"
          :responsiveOptions="responsiveOptions" circular>
          <template #item="{ data }">
            <div class="flex flex-col min-h-screen m-auto">
              <div class="img-container max-h-screen object-cover  m-auto ">
                <Image :src="data.url" :alt="data.productTitle" class="img object-scale-down size-fit"
                  @click="$emit('close')" />
              </div>
              <div class="flex"><a :href="data.productUrl"
                  class="img-link underline flex m-auto justify-center text-center"><span
                    class="mb-4 font-bold flex m-auto justify-center text-center">{{
                      data.productTitle
                    }}</span></a></div>
            </div>
          </template>
        </Carousel>
      </div>
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
  (e: 'update:visible', value: boolean): void;
}>();

const handleVisibilityChange = (value: boolean) => {
  if (!value) {
    emit('update:visible', false);
    emit('close');
  }
};


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
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.img {
  width: 50%;
  max-width: 90%;
  max-height: calc(100vh - 255px);
}
</style>