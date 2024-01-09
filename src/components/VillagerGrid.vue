<template>
  <div>
    <div class="grid grid-cols-3 place-items-center gap-3 p-3">
      <div
        class="btn btn-square bg-base-100 w-full h-full shadow-sm shadow-black flex-col py-1"
        v-for="(villager, index) in store.untrackedVillagers"
        :key="villager.name"
        @click="store.startTracking(index)"
      >
        <img :src="villager.iconURL" :id="villager.name" />
        <p class="text-xs">{{ villager.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';

const store = useStore();
</script>
