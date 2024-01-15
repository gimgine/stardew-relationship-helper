<template>
  <div class="flex bg-base-100 rounded shadow-md shadow-black">
    <div class="flex flex-col md:flex-row flex-grow">
      <div class="flex">
        <a class="hover:brightness-75 flex items-end" target="_blank" :href="props.villager.wikiURL">
          <img class="min-w-[96px] h-[96px] md:min-w-[128px] md:h-[128px]" :src="props.villager.imgURL" :id="props.villager.name + 'Image'" />
        </a>
        <div class="flex flex-col justify-center pl-6 pr-10">
          <h1 class="text-xl md:text-3xl font-bold">
            {{ props.villager.name.charAt(0).toUpperCase() + props.villager.name.slice(1) }}
          </h1>
          <div class="flex items-center">
            <img class="object-contain mt-1 w-6 md:w-9" src="@/assets/heart-icon.webp" />
            <h1 class="text-xl md:text-3xl font-bold ml-1">
              {{ isNaN(Math.floor(props.villager.friendshipPoints / 250)) ? 0 : Math.floor(props.villager.friendshipPoints / 250) }}
            </h1>
            <img class="object-contain w-6 md:w-9 ml-2" v-if="villager.isMarried" src="@/assets/mermaids-pendant.png" />
          </div>
        </div>
      </div>
      <div class="flex flex-grow">
        <div class="flex flex-col p-2 flex-grow">
          <p class="text-xs italic pb-1">you have</p>
          <div class="flex overflow-x-auto h-12">
            <img
              class="object-contain"
              v-for="item in inventoryStore.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity > 0)"
              :key="item.name"
              :src="item.imgURL"
              draggable="false"
              v-draggable="{ onDragEnd: () => onDragEnd(item.name), onDrag }"
            />
          </div>
          <p class="text-xs italic py-1">you could get</p>
          <div class="flex overflow-x-auto">
            <img
              class="brightness-50 object-contain"
              v-for="item in inventoryStore.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity === 0)"
              :key="item.name"
              :src="item.imgURL"
              draggable="false"
            />
          </div>
        </div>
        <ShippingBin ref="bin" class="min-w-[48px] max-w-[48px] md:min-w-[56px] md:max-w-[56px]" />
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
