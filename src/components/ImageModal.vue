<template class="overflow-hidden">
  <Dialog ref="maxDialog" :visible="isVisible" maximizable class="flex max-h-screen max-w-screen overflow-hidden"
    @show="biggifyDialog" @update:visible="handleVisibilityChange" :showHeader="false" :blockScroll="true" :minX="0"
    :minY="0" @hide="emit('close')">
    <div class="container flex h-screen w-full m-auto overflow-hidden min-w-screen min-h-screen">
      <div class="m-auto flex flex-col justify-center max-w-screen max-h-screen">
        <Carousel :value="images" :numVisible="1" :responsiveOptions="responsiveOptions" circular
          :showNavigators="images.length > 1" :showIndicators="false" :pt="carouselPT">
          <template #item="{ data }">
            <div class="flex flex-col min-h-screen m-auto">
              <div class="img-container max-h-screen object-cover m-auto">
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
import { defineProps, ref, computed } from 'vue';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Carousel from 'primevue/carousel';


const carouselPT = {
  pcPrevButton: {
    root: '!size-16',
    icon: {
      class: '!size-12',
    },
  },
  pcNextButton: {
    root: '!size-16',
    icon: {
      class: '!size-12',
    }
  }
};



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

const showNavigators = computed(() => props.images.length > 1);

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 1,
    numScroll: 1,
    showNavigators: true
  },
  {
    breakpoint: '1199px',
    numVisible: 1,
    numScroll: 1,
    showNavigators: true
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1,
    showNavigators: true
  },
  {
    breakpoint: '575px',
    numVisible: 2,
    numScroll: 1,
    showNavigators: true
  }
]);
</script>

<style scoped>
/* still needed that container class because primevue carousel doesnt have position out of the box like dialog  */
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

.img {
  width: 50%;
  max-height: 100vh;
  object-fit: scale-down;
}
</style>