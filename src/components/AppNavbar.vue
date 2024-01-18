<template>
  <div class="navbar bg-base-200 justify-between">
    <div class="navbar-start md:hidden">
      <div class="dropdown">
        <label for="drawer" class="btn btn-ghost md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
      </div>
    </div>
    <div class="navbar-center ml-3">
      <img class="h-8 mr-3" src="https://stardewvalleywiki.com/mediawiki/images/6/61/Blue_Chicken.png" />
      <span class="hidden md:block text-lg font-bold normal-case overflow-hidden whitespace-nowrap">Stardew Relationship Helper</span>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end md:hidden">
        <div tabindex="0" role="button" class="btn m-1">
          <font-awesome-icon icon="fa-solid fa-calendar" size="lg" />
        </div>
        <div tabindex="0" class="dropdown-content mt-4 z-[1] p-2 shadow-lg bg-base-200 rounded-box w-72">
          <DateTracker />
        </div>
      </div>
      <ul class="hidden !h-[48px] md:flex menu menu-horizontal text-base-content">
        <li><label @click="emit('import-save-click')">Import Save</label></li>
        <li><a @click="emit('reset-click')">Reset</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateTracker from './DateTracker.vue';

const emit = defineEmits<{
  (e: 'import-save-click'): void;
  (e: 'reset-click'): void;
}>();
</script>
