<template>
  <div class="drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <!-- Main content -->
    <div class="drawer-content">
      <!-- Mobile -->
      <div class="md:hidden" data-theme="dark">
        <label for="drawer" class="h-10 mb-2 flex flex-nowrap items-center btn gap-5 bg-base-200 drawer-button">
          <img class="object-contain h-4/5" src="https://stardewvalleywiki.com/mediawiki/images/6/61/Blue_Chicken.png" />
          <span class="text-lg font-bold normal-case overflow-hidden whitespace-nowrap">Stardew Relationship Helper</span>
        </label>
        <TrackingList v-if="props.option === HomeViewOption.TRACKER" />
        <VillagerGrid v-else-if="props.option === HomeViewOption.VILLAGERS" />
        <InventoryGrid v-else-if="props.option === HomeViewOption.INVENTORY" />
      </div>

      <div class="hidden md:grid grid-cols-5 grid-rows-1 h-screen max-h-screen p-4 gap-4" data-theme="dark">
        <!-- Left column -->
        <div class="col-span-1 flex flex-col">
          <label for="drawer" class="h-10 mb-2 flex flex-nowrap items-center btn gap-5 bg-base-200 drawer-button">
            <img class="object-contain h-4/5" src="https://stardewvalleywiki.com/mediawiki/images/6/61/Blue_Chicken.png" />
            <span class="text-lg font-bold normal-case overflow-hidden whitespace-nowrap">Stardew Relationship Helper</span>
          </label>
          <div class="flex-1 overflow-y-auto bg-base-200 rounded shadow-md shadow-black">
            <VillagerGrid />
          </div>
        </div>

        <!-- Center column -->
        <div class="col-span-3">
          <div class="overflow-y-auto h-full rounded bg-base-200 shadow-md shadow-black">
            <TrackingList class="overflow-hidden" />
          </div>
        </div>

        <!-- Right column -->
        <div class="col-span-1 flex flex-col gap-4">
          <div class="bg-base-200 rounded shadow-md shadow-black">
            <DateTracker />
          </div>
          <div class="bg-base-200 rounded shadow-md shadow-black flex flex-col flex-grow items-center justify-between overflow-y-auto p-2">
            <InventoryGrid />
            <div class="italic text-xs tracking-wide">by @naroop and @jreinke428 2023</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer menu -->
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 bg-base-100 text-base-content h-full">
        <div class="md:hidden">
          <li><label @click="$router.push({ path: `/${HomeViewOption.TRACKER}` })">Tracker</label></li>
          <li><label @click="$router.push({ path: `/${HomeViewOption.VILLAGERS}` })">Villagers</label></li>
          <li><label @click="$router.push({ path: `/${HomeViewOption.INVENTORY}` })">Inventory</label></li>
        </div>
        <li class="menu-title">
          <span>Actions</span>
        </li>
        <li><label @click="openModal">Import Save File</label></li>
        <li><a @click="store.reset()">Reset</a></li>
      </ul>
    </div>
    <ImportSaveModal ref="importSaveModal" />
  </div>
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
  option: { type: Object as PropType<HomeViewOption>, required: true }
});

function openModal() {
  importSaveModal.value?.showModal();
}
</script>
