<template lang="html">
  <div class="p-3 w-full">
    <input v-model="inventoryStore.inventoryFilter" type="text" placeholder="Search" class="input min-h-[3rem] w-full mb-2 bg-base-100" />

    <div class="flex flex-col w-full overflow-y-auto overflow-x-hidden">
      <div class="flex gap-3 items-center border-b-2 py-2 border-base-100" v-for="item in inventoryStore.filteredInventory" :key="item.name">
        <a :href="item.wikiURL" target="_blank">
          <img class="hover:brightness-75 object-fill md:max-w-[1.5rem]" :src="item.imgURL" />
        </a>
        <p
          class="truncate flex-grow md:text-sm"
          v-html="
            item.name.replace(
              new RegExp(inventoryStore.inventoryFilter.toLowerCase(), 'i'),
              (match) => `<strong class='text-primary'>${match}</strong>`
            )
          "
        ></p>
        <div class="flex touch-none">
          <span
            class="btn sm:btn-sm md:btn-xs rounded-tl rounded-bl rounded-none bg-neutral border-none"
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
            class="w-[2rem] text-center bg-neutral rounded-none"
          />
          <span
            class="btn sm:btn-sm md:btn-xs rounded-tr rounded-br rounded-none bg-neutral border-none"
            @click="inventoryStore.changeQuantity(item.name, 1)"
          >
            +
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '@/store';

const inventoryStore = useInventoryStore();
</script>
