<template>
  <ul class="menu py-4 gap-3 w-56 bg-base-100 text-base-content h-full">
    <li>
      <label for="drawer" @click="emit('navigate', HomeViewOption.TRACKER)">
        <a :class="[props.option === HomeViewOption.TRACKER ? 'font-bold' : '']">
          <font-awesome-icon class="mr-1 text-red-400" icon="fa-solid fa-heart" />
          Tracker
        </a>
      </label>
    </li>
    <li>
      <label for="drawer" @click="emit('navigate', HomeViewOption.VILLAGERS)">
        <a :class="[props.option === HomeViewOption.VILLAGERS ? 'font-bold' : '']">
          <font-awesome-icon class="mr-1 text-green-400" icon="fa-solid fa-user-plus" />
          Villagers
        </a>
      </label>
    </li>
    <li>
      <label for="drawer" @click="emit('navigate', HomeViewOption.INVENTORY)">
        <a :class="[props.option === HomeViewOption.INVENTORY ? 'font-bold' : '']">
          <font-awesome-icon class="mr-1 text-blue-400" icon="fa-solid fa-boxes-stacked" />
          Inventory
        </a>
      </label>
    </li>
    <li class="menu-title">Actions</li>
    <li class="flex flex-col">
      <label for="drawer" @click="emit('import-save-click')">
        <a>
          <font-awesome-icon class="mr-1" icon="fa-solid fa-file-import" />
          Import Save File
        </a>
      </label>
    </li>
    <li>
      <label for="drawer" @click="emit('reset-click')">
        <a>
          <font-awesome-icon class="mr-1" icon="fa-solid fa-arrows-rotate" />
          Reset
        </a>
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { HomeViewOption } from '@/models';
import type { PropType } from 'vue';

const props = defineProps({
  option: { type: String as PropType<HomeViewOption>, required: true }
});

const emit = defineEmits<{
  (e: 'navigate', option: HomeViewOption): void;
  (e: 'import-save-click'): void;
  (e: 'reset-click'): void;
}>();
</script>
