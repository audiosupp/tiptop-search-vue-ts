<template>
  <Dialog ref="maxDialog" :visible="isVisible" maximizable header="Title" class="w-full" @show="biggifyDialog">
    <div class="container p-8">
      <Carousel class="" :value="images" :numVisible="1" :responsiveOptions="responsiveOptions" circular>
        <template #item="item">
          <div class="img-container p-36">
            <Image :src="item.data" :alt="item" class="img" @click="$emit('close')" />
            <a href="" class="img-link"><span class="mb-4 font-medium">{{ item.data }}</span></a>
          </div>
        </template>
      </Carousel>
    </div>
  </Dialog>
</template>

<script lang='ts' setup>
import { defineProps, ref, watch, onMounted } from 'vue';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';



// Reference to the dialog instance
const maxDialog = ref<InstanceType<typeof Dialog> | null>(null);

// Function to maximize the dialog
function biggifyDialog() {
  if (maxDialog.value) {
    maxDialog.value.maximized = true;
  }
}

const displayBasic = ref(false);

const props = defineProps<{
  images: { url: string }[];
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void; // Emit close event to parent
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
/* .no-images {
  text-align: center;
} */

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

/* .w-100 {
  width: 50% !important;
  height: 50%;
} */
</style>