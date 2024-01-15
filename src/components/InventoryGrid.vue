<template lang="html">
  <input v-model="inventoryStore.inventoryFilter" type="text" placeholder="Search" class="input min-h-[3rem] w-full max-w-xs mt-2 mx-2" />
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(76px,1fr))] overflow-y-auto overflow-x-hidden">
    <div class="min-w-[4.8rem] flex items-center flex-col" v-for="item in inventoryStore.filteredInventory" :key="item.name">
      <a :href="item.wikiURL" target="_blank" class="tooltip" :data-tip="item.name">
        <img class="mb-1 hover:brightness-75" :src="item.imgURL" />
      </a>
      <div class="flex">
        <span
          class="indicator-item indicator-bottom indicator-start btn btn-xs rounded-tl rounded-bl rounded-none bg-neutral border-none"
          @click="inventoryStore.changeQuantity(item.name, -1)"
        >
          -
        </span>
        <input
          :value="item.quantity"
          @input="
            (e: any) => {
              if (!isNaN(e.target?.value) && e.target?.value !== '') {
                e.target.value = item.quantity = Math.max(0, parseInt(e.target?.value));
              } else if (e.target?.value !== '') {
                e.target.value = item.quantity;
              }
            }
          "
          @focusout="
            (e: any) => {
              if (e.target.value === '') e.target.value = item.quantity = 0;
            }
          "
          class="indicator-item indicator-bottom indicator-center w-[1.5rem] text-center bg-neutral"
        />
        <span
          class="indicator-item indicator-bottom indicator-end btn btn-xs rounded-tr rounded-br rounded-none bg-neutral border-none"
          @click="inventoryStore.changeQuantity(item.name, 1)"
        >
          +
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '@/store';

const inventoryStore = useInventoryStore();
</script>
