<template>
  <!-- Navbar -->
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
        <li><label @click="openModal">Import Save</label></li>
        <li><a @click="store.reset()">Reset</a></li>
      </ul>
    </div>
  </div>

  <!-- Mobile -->
  <div class="md:hidden drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <!-- Main content -->
    <div class="drawer-content">
      <div class="h-[calc(100vh-8rem)] overflow-y-auto">
        <TrackingList v-if="props.option === HomeViewOption.TRACKER" />
        <VillagerGrid v-else-if="props.option === HomeViewOption.VILLAGERS" />
        <InventoryGrid v-else-if="props.option === HomeViewOption.INVENTORY" />
      </div>

      <!-- Bottom nav -->
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
    </div>

    <!-- Drawer menu -->
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay"></label>
      <ul class="menu py-4 gap-3 w-56 bg-base-100 text-base-content h-full">
        <li class="flex flex-col">
          <label for="drawer" @click="openModal">
            <a>
              <font-awesome-icon class="mr-1" icon="fa-solid fa-file-import" />
              Import Save File
            </a>
          </label>
        </li>
        <li>
          <label for="drawer" @click="store.reset()">
            <a>
              <font-awesome-icon class="mr-1" icon="fa-solid fa-arrows-rotate" />
              Reset
            </a>
          </label>
        </li>
      </ul>
    </div>
  </div>

  <!-- Desktop -->
  <div class="hidden md:grid grid-cols-5 grid-rows-1 max-h-[calc(100vh-4rem)] p-4 gap-4" data-theme="dark">
    <!-- Left column -->
    <div class="col-span-1 flex flex-col">
      <div class="flex-1 overflow-y-auto bg-base-200 rounded shadow-md shadow-black">
        <VillagerGrid />
      </div>
    </div>

    <!-- Center column -->
    <div class="col-span-3 grid grid-rows-3 gap-4">
      <div class="row-span-2 overflow-y-auto rounded bg-base-200 shadow-md shadow-black">
        <TrackingList class="overflow-hidden" />
      </div>
      <div class="row-span-1 bg-base-200 rounded shadow-md shadow-black flex flex-col gap-3">
        <InventoryGrid />
      </div>
    </div>

    <!-- Right column -->
    <div class="col-span-1 grid grid-rows-4 gap-4">
      <div class="row-span-1 bg-base-200 overflow-y-auto rounded shadow-md shadow-black">
        <DateTracker />
      </div>
      <div class="row-span-3 bg-base-200 rounded shadow-md shadow-black flex items-end justify-center">
        <div class="italic text-xs tracking-wide mb-2 text-center">by @naroop and @jreinke428 2024</div>
      </div>
    </div>
  </div>
  <ImportSaveModal ref="importSaveModal" />
</template>

<script setup lang="ts">
import DateTracker from '@/components/DateTracker.vue';
import VillagerGrid from '@/components/VillagerGrid.vue';
import TrackingList from '@/components/TrackingList/TrackingList.vue';
import InventoryGrid from '@/components/InventoryGrid.vue';
import ImportSaveModal from '@/components/ImportSaveModal.vue';
import { useStore } from '@/store';
import { ref, type PropType } from 'vue';
import { HomeViewOption } from '@/models';

const importSaveModal = ref({} as InstanceType<typeof ImportSaveModal>);

const store = useStore();

const props = defineProps({
  option: { type: String as PropType<HomeViewOption>, required: true }
});

function openModal() {
  importSaveModal.value?.showModal();
}
</script>
