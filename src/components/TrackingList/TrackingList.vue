<template lang="html">
  <div class="flex flex-col gap-3 p-2">
    <TrackingListItem v-for="(villager, index) in store.trackedVillagers" :key="villager.name" :villager="villager" :index="index" ref="items" />
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/store';
import TrackingListItem from './TrackingListItem.vue';
import { nextTick, provide, ref } from 'vue';
import type { Ref } from 'vue';

const items: Ref<Array<typeof TrackingListItem>> = ref([]);

const store = useStore();

window.onmousemove = (e: MouseEvent) => {
  items.value.forEach((item) => {
    let rect = item.bin.img.getBoundingClientRect();
    if (e.x <= rect.right && e.x >= rect.left && e.y >= rect.top && e.y <= rect.bottom) {
      if (!item.bin.hovering && store.dragging) {
        store.hovering = item.villager.name;
        item.bin.startHovering();
      }
    } else if (item.bin.hovering) {
      store.hovering = '';
      item.bin.stopHovering();
    }
  });
};

const itemDrop = () => {
  items.value.forEach((item) => {
    if (item.bin.hovering) item.bin.stopHovering();
  });
  nextTick(() => {
    store.hovering = '';
  });
};

provide('itemDrop', itemDrop);
</script>
