<template>
  <div class="flex flex-col gap-3 p-2">
    <TrackingListItem v-for="villager in villagerStore.trackedVillagers" :key="villager.name" :villager="villager" />
  </div>
</template>

<script setup lang="ts">
import { useVillagerStore } from '@/store';
import TrackingListItem from './TrackingListItem.vue';

const villagerStore = useVillagerStore();
</script>
