<template>
  <div class="flex justify-between bg-base-100 rounded shadow-md shadow-black" ref="listItem">
    <div class="flex">
      <a class="hover:brightness-75 flex items-end" target="_blank" :href="props.villager.wikiURL">
        <img class="min-w-[128px] h-[128px]" :src="props.villager.imgURL" :id="props.villager.name + 'Image'" />
      </a>
      <div class="flex flex-col justify-center pl-6 pr-10">
        <h1 class="text-3xl font-bold">
          {{ props.villager.name.charAt(0).toUpperCase() + props.villager.name.slice(1) }}
        </h1>
        <div class="flex items-center">
          <img class="object-contain mt-1" src="@/assets/heart-icon.webp" />
          <h1 class="text-3xl font-bold ml-1">
            {{ isNaN(Math.floor(props.villager.friendshipPoints / 250)) ? 0 : Math.floor(props.villager.friendshipPoints / 250) }}
          </h1>
          <img class="object-contain h-9 ml-3" v-if="villager.isMarried" src="@/assets/mermaids-pendant.png" />
        </div>
      </div>
      <div class="flex flex-col py-2 overflow-x-auto">
        <p
          :class="[
            'text-xs italic',
            store.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity > 0).length === 0 ? 'pb-[52px]' : 'pb-1'
          ]"
        >
          you have
        </p>
        <div class="flex">
          <DraggableItem
            v-for="item in store.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity > 0)"
            :key="item.name"
            :name="item.name"
          >
            <img class="object-contain" :src="item.imgURL" draggable="false" />
          </DraggableItem>
        </div>
        <p class="text-xs italic py-1">you could get</p>
        <div class="flex">
          <img
            class="brightness-50 object-contain"
            v-for="item in store.inventory.filter((i) => villager.loves.some((j) => i.name === j.name) && i.quantity === 0)"
            :key="item.name"
            :src="item.imgURL"
          />
        </div>
      </div>
    </div>
    <div class="flex">
      <ShippingBin ref="bin" class="" />
      <div class="col-span-1 flex flex-col justify-between items-end">
        <font-awesome-icon
          :class="['p-2 text-warning', areDatesEqual(villager.birthday, store.date) ? 'block' : 'invisible']"
          icon="fa-solid fa-cake-candles"
          beat-fade
          size="xl"
        />
        <button class="btn btn-xs rounded-br rounded-tl rounded-none text-error" @click="store.stopTracking(villager.name)">
          <font-awesome-icon icon="fa-solid fa-xmark" size="lg" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { StardewDate, Villager } from '@/models';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useStore } from '@/store';
import DraggableItem from '../DraggableItem.vue';
import ShippingBin from '../TrackingList/ShippingBin.vue';

const bin: Ref<typeof ShippingBin> = ref(ShippingBin);

const store = useStore();

const props = defineProps({
  villager: { type: Object as () => Villager, required: true }
});

function areDatesEqual(date1: StardewDate, date2: StardewDate) {
  return date1.day === date2.day && date1.season === date2.season ? true : false;
}

defineExpose({ bin, villager: props.villager });
</script>
