<template>

  <!-- <Galleria :modal="true" :value="images" :visible="isVisible" :responsiveOptions="responsiveOptions" :numVisible="5"
    containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true"
    :showThumbnails="false" @hide="emit('close')" @close="emit('close')">
    <template #item="{ item }">
      <div>
        <Image :src="item" :alt="item" style="width: 100%; display: block" />
        <Button :href="item" target="_blank">View Product</Button>
      </div>
    </template>
</Galleria> -->


  <Dialog ref="maxDialog" :visible="isVisible" maximizable header="Title" class="w-full" @show="biggifyDialog">
    <div class="container p-8">
      <Carousel class="" :value="images" :numVisible="1" :responsiveOptions="responsiveOptions" circular>
        <template #item="item">
          <!-- <p>{{ item }}</p> -->
          <div class="img-container">
            <Image :src="item.data" :alt="item" class="img" @click="$emit('close')" />
            <!-- <Tag :value="item.data" severity="p-success" class="absolute" style="left:5px; top: 5px" /> -->
            <a href="" class="img-link"><span class="mb-4 font-medium">{{ item.data }}</span></a>

          </div>
        </template>
      </Carousel>
    </div>
  </Dialog>


  <!-- <div class="flex flex-row min-h-max justify-center items-center w-1/2">
          <Image :src="item.data" :alt="item" class="" />
          <a :href="item" target="_blank">View Product</a>
        </div> -->
  <!-- <div class="mb-4">
          <div class="relative mx-auto">
            <Image :src="item.data" :alt="item" class="" />
            <Tag :value="item.data" severity="p-success" class="absolute" style="left:5px; top: 5px" />
          </div>
        </div> -->

  <!-- <Dialog :visible="isVisible">
    <Carousel :modal="true" :value="images" :visible="isVisible" :fullScreen="true" :numVisible="1" :numScroll="1">
      <template #item="{ item }">
        <div class="carousel-item">
          <Image :src="item" :alt="item" style="width: 100%; display: block" />
          <a :href="item" target="_blank">View Product</a>
        </div>
      </template>
    </Carousel>
  </Dialog> -->

  <!-- <Dialog :visible="isVisible" class="w-full" modal>
    <Galleria :value="carouselImages" :numVisible="1" :numScroll="1">
      <template #item="{ item }">


        <img :src="item" :alt="item" style="width: 100%; display: block;" />
        <a :href="item" target="_blank">View Product</a>


      </template>
    </Galleria>
  </Dialog> -->

  <!-- <Image src="https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg" alt="item"
    style="width: 100%; display: block" /> -->

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


function showDialog() {
  this.$refs.myDialog.maximized = true
}


const showModal = ref(false);
// const thumbnail = 'https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg'; // Replace with your thumbnail path
// const images = ref([
//   { src: 'https://primefaces.org/cdn/primevue/images/product/blue-t-shirt.jpg', link: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg' },
//   { src: 'https://primefaces.org/cdn/primevue/images/product/black-watch.jpg', link: 'https://primefaces.org/cdn/primevue/images/product/blue-t-shirt.jpg' },
//   { src: 'https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg', link: 'https://primefaces.org/cdn/primevue/images/product/blue-t-shirt.jpg' },
// ]);
const carouselImages = ref<{ url: string }[]>([]);

// Watch for changes in the images prop
watch(() => props.images, (newImages) => {
  // Populate carouselImages when images prop changes
  carouselImages.value = newImages;
}, { immediate: true }); // Immediate will run the watcher on mount

// Optionally, you can also use onMounted if you want to perform actions on mount
onMounted(() => {
  // You can perform any additional setup here if needed
});

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
    numVisible: 1,
    numScroll: 1,
    showNavigators: false
  },
  {
    breakpoint: '575px',
    numVisible: 1,
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
  max-height: 100vh;
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
  overflow: hidden;
}

.img-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 80vh;
  max-width: 90vw;
  overflow: hidden;
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