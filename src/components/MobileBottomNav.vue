<template>
  <div class="md:hidden btm-nav bg-base-200">
    <button :class="[props.option === HomeViewOption.VILLAGERS ? 'active' : '']" @click="$router.push({ path: `/${HomeViewOption.VILLAGERS}` })">
      <font-awesome-icon icon="fa-solid fa-user-plus" class="text-green-400" />
      <span class="btn-nav-label">Villagers</span>
    </button>
    <button :class="[props.option === HomeViewOption.TRACKER ? 'active' : '']" @click="$router.push({ path: `/${HomeViewOption.TRACKER}` })">
      <font-awesome-icon icon="fa-solid fa-heart" class="text-red-400" />
      <span class="btn-nav-label">Tracker</span>
    </button>
    <button :class="[props.option === HomeViewOption.INVENTORY ? 'active' : '']" @click="$router.push({ path: `/${HomeViewOption.INVENTORY}` })">
      <font-awesome-icon icon="fa-solid fa-boxes-stacked" class="text-blue-400" />
      <span class="btn-nav-label">Inventory</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { HomeViewOption } from '@/models';
import type { PropType } from 'vue';

const props = defineProps({
  option: { type: String as PropType<HomeViewOption>, required: true }
});
</script>
