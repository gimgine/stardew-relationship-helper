<template>
  <div class="flex justify-center items-center">
    <img class="object-fit" ref="img" :src="frames[currentFrame]" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue';

interface FrameModule {
  default: string;
}

const hovering: Ref<boolean> = ref(false);
const img: Ref<HTMLElement | null> = ref(null);
const currentFrame: Ref<number> = ref(0);
const interval: Ref<number | null> = ref(null);
const frames: Ref<string[]> = ref([]);

// Function to load images using import.meta.glob
const loadImages = async () => {
  const frameFiles = import.meta.glob('@/assets/shipping-bin/*.png');
  const modules = await Promise.all(
    Object.entries(frameFiles).map(async ([, importFn]) => {
      const module = (await importFn()) as FrameModule;
      return module.default;
    })
  );
  frames.value = modules;
};

onMounted(() => {
  loadImages();
});

const startAnimation = (change: number) => {
  if (interval.value) clearInterval(interval.value);
  interval.value = setInterval(() => {
    currentFrame.value += change;
    if (currentFrame.value > frames.value.length) {
      currentFrame.value = frames.value.length - 1;
    } else if (currentFrame.value < 0) {
      currentFrame.value = 0;
    }
  }, 50);
};

const startHovering = () => {
  hovering.value = true;
  startAnimation(1);
};

const stopHovering = () => {
  hovering.value = false;
  startAnimation(-1);
};

watch(currentFrame, (value) => {
  if (value === 0 || value === frames.value.length - 1) {
    if (interval.value) clearInterval(interval.value);
  }
});

defineExpose({ img, hovering, startHovering, stopHovering });
</script>
