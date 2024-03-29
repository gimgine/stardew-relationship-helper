<template>
  <!-- Navbar -->
  <AppNavbar @import-save-click="openModal()" @reset-click="store.reset()" />

  <!-- Mobile -->
  <div class="md:hidden overflow-y-auto drawer [position:initial]">
    <input id="drawer" type="checkbox" class="drawer-toggle" />

    <!-- Main content -->
    <div class="drawer-content">
      <div class="bg-base-200">
        <TrackingList v-if="props.option === HomeViewOption.TRACKER" />
        <VillagerGrid v-else-if="props.option === HomeViewOption.VILLAGERS" />
        <div v-else-if="props.option === HomeViewOption.INVENTORY">
          <InventoryGrid />
        </div>
      </div>
      <!-- <MobileBottomNav :option="props.option" /> -->
    </div>

    <!-- Drawer menu -->
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay"></label>
      <MobileDrawerMenu :option="props.option" @navigate="handleNavigation" @import-save-click="openModal" @reset-click="store.reset" />
    </div>
  </div>

  <!-- Desktop -->
  <div class="hidden md:grid grid-cols-5 grid-rows-1 h-[calc(100vh-4rem)] p-4 gap-4" data-theme="dark">
    <!-- Left column -->
    <div class="col-span-1 flex flex-col">
      <div class="flex-1 overflow-y-auto bg-base-200 rounded shadow-md shadow-black">
        <VillagerGrid />
      </div>
    </div>

    <!-- Center column -->
    <div class="col-span-3 grid grid-rows-1 gap-4">
      <div class="row-span-1 overflow-y-auto rounded bg-base-200 shadow-md shadow-black">
        <TrackingList class="overflow-hidden" />
      </div>
    </div>

    <!-- Right column -->
    <div class="col-span-1 flex flex-col gap-4">
      <div class="bg-base-200 overflow-y-auto rounded shadow-md shadow-black">
        <DateTracker />
      </div>
      <div class="bg-base-200 rounded shadow-md shadow-black flex flex-1 flex-col items-center justify-between overflow-y-auto">
        <InventoryGrid />
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
// import MobileBottomNav from '@/components/MobileBottomNav.vue';
import MobileDrawerMenu from '@/components/MobileDrawerMenu.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import { useStore } from '@/store';
import { ref, type PropType } from 'vue';
import { HomeViewOption } from '@/models';
import router from '@/router';

const importSaveModal = ref({} as InstanceType<typeof ImportSaveModal>);

const store = useStore();

const props = defineProps({
  option: { type: String as PropType<HomeViewOption>, required: true }
});

function openModal() {
  importSaveModal.value?.showModal();
}

const handleNavigation = (option: HomeViewOption) => {
  router.push({ path: `/${option}` });
};
</script>
