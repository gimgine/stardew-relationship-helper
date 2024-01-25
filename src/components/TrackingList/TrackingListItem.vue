<template>
  <div class="flex bg-base-100 rounded shadow-md shadow-black">
    <div class="flex flex-col md:flex-row flex-grow">
      <!-- Picture/name/hearts -->
      <div class="flex min-w-72 overflow-x-auto">
        <!-- Picture -->
        <a class="hover:brightness-75 flex items-end" target="_blank" :href="props.villager.wikiURL">
          <img class="min-w-[96px] h-[96px] md:min-w-[128px] md:h-[128px]" :src="props.villager.imgURL" :id="props.villager.name + 'Image'" />
        </a>
        <!-- Name/hearts -->
        <div class="flex flex-col flex-grow justify-center group h-full">
          <h1 class="text-xl md:text-3xl font-bold">
            {{ props.villager.name.charAt(0).toUpperCase() + props.villager.name.slice(1) }}
          </h1>

          <div class="flex items-center relative">
            <div class="flex flex-col w-1/2">
              <div class="flex items-center justify-around px-1">
                <img class="object-contain mt-1 w-6 md:w-9" src="@/assets/heart-icon.webp" />
                <h1 class="text-xl md:text-3xl font-bold pr-1">
                  {{ isNaN(Math.floor(props.villager.friendshipPoints / 250)) ? 0 : Math.floor(props.villager.friendshipPoints / 250) }}
                </h1>
              </div>

              <div class="w-full flex flex-col items-center text-center pt-1">
                <progress class="progress progress-success" :value="props.villager.friendshipPoints % 250" max="250" />
                <span class="text-xs italic font-light cursor-default opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ props.villager.friendshipPoints % 250 }} / 250
                </span>
              </div>
            </div>
            <ShippingBin ref="bin" class="min-w-[40px] max-w-[40px] md:min-w-[50px] md:max-w-[50px] absolute right-3" />
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="flex flex-grow">
        <div class="flex flex-col p-2 flex-grow select-none">
          <p class="text-xs italic pb-1">have</p>
          <div class="flex overflow-x-auto h-12">
            <img
              class="object-contain [-webkit-touch-callout:none!important]"
              v-for="item in inventoryStore.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity > 0)"
              :key="item.name"
              :src="item.imgURL"
              draggable="false"
              v-draggable="{ onDragEnd: () => onDragEnd(item.name), onDrag }"
            />
          </div>
          <p class="text-xs italic py-1">don't have</p>
          <div class="flex overflow-x-auto">
            <img
              class="brightness-50 hover:opacity-70 object-contain"
              v-for="item in inventoryStore.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity === 0)"
              :key="item.name"
              :src="item.imgURL"
              draggable="false"
              @click="useInventoryStore().inventoryFilter = item.name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between">
      <font-awesome-icon
        :class="['p-2 text-warning', areDatesEqual(villager.birthday, store.date) ? 'block' : 'invisible']"
        icon="fa-solid fa-cake-candles"
        beat-fade
        size="xl"
      />
      <button class="btn btn-xs rounded-br rounded-tl rounded-none text-error" @click="villagerStore.stopTracking(villager.name)">
        <font-awesome-icon icon="fa-solid fa-xmark" size="lg" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { StardewDate, Villager } from '@/models';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useInventoryStore, useStore, useVillagerStore } from '@/store';
import ShippingBin from '../TrackingList/ShippingBin.vue';

const bin: Ref<typeof ShippingBin> = ref(ShippingBin);

const store = useStore();
const villagerStore = useVillagerStore();
const inventoryStore = useInventoryStore();

const props = defineProps({
  villager: { type: Object as () => Villager, required: true }
});

function areDatesEqual(date1: StardewDate, date2: StardewDate) {
  return date1.day === date2.day && date1.season === date2.season ? true : false;
}

const onDrag = (x: number, y: number) => {
  const binRect = bin.value.$el.getBoundingClientRect();
  if (binRect.left <= x && x <= binRect.right && binRect.top <= y && y <= binRect.bottom) {
    if (!bin.value.hovering) bin.value?.startHovering();
  } else if (bin.value.hovering) {
    bin.value.stopHovering();
  }
};

const onDragEnd = (item: string) => {
  console.log(item);
  if (bin.value.hovering) {
    bin.value.stopHovering();
    store.giveItem(props.villager.name, item);
  }
};

defineExpose({ villager: props.villager });
</script>
