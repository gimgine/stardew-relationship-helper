import { defineStore } from 'pinia';
import data from './data.json';
import { type Item, type Villager, type StardewDate, Season } from '@/models/index';
import { ref, watch } from 'vue';

export const useStore = defineStore('store', () => {
  const untrackedVillagers = ref<Villager[]>([]);
  const trackedVillagers = ref<Villager[]>([]);
  const inventory = ref<Item[]>([]);
  const inventoryFilter = ref<string>('');
  const filteredInventory = ref<Item[]>([]);
  const date = ref<StardewDate>({} as StardewDate);
  const dragging = ref<string>('');
  const hovering = ref<string>('');

  const init = () => {
    data.forEach((villager) => villager.loves.sort((item1, item2) => (item1.name > item2.name ? 1 : -1)));

    const localTrackedVillagers = localStorage.getItem('trackedVillagers');
    if (localTrackedVillagers) {
      trackedVillagers.value = JSON.parse(localTrackedVillagers) as Villager[];
      untrackedVillagers.value = (data as Villager[]).filter((villager) => !trackedVillagers.value.find((v) => v.name === villager.name));
    } else {
      untrackedVillagers.value = data as Villager[];
    }

    const localInventory = localStorage.getItem('inventory');
    inventory.value = localInventory ? JSON.parse(localInventory) : [];

    const localDate = localStorage.getItem('date');
    date.value = localDate ? JSON.parse(localDate) : { season: Season.SPRING, day: 1 };
  };

  const reset = () => {
    data.forEach((villager) => villager.loves.sort((item1, item2) => (item1.name > item2.name ? 1 : -1)));
    untrackedVillagers.value = data as Villager[];
    trackedVillagers.value = [];
    inventory.value = [];
    date.value = { season: Season.SPRING, day: 1 };
  };

  const addSaveFileData = (friendshipData: [{ name: string; friendshipPoints: number; status: string }], saveFileDate: StardewDate) => {
    trackedVillagers.value.forEach((trackedVillager) => {
      const data = friendshipData.find((villager) => villager.name === trackedVillager.name);
      if (data) {
        trackedVillager.friendshipPoints = data.friendshipPoints;
      }
    });
    date.value = saveFileDate;
  };

  const startTracking = (index: number) => {
    const vill: Villager = removeVillager(index, untrackedVillagers.value);
    vill.friendshipPoints = 0;
    trackedVillagers.value.push(vill);
    addItemsToInventory(inventory.value, vill.loves);
  };

  const stopTracking = (index: number) => {
    const vill: Villager = removeVillager(index, trackedVillagers.value);
    untrackedVillagers.value.push(vill);
    untrackedVillagers.value.sort((a, b) => (a.name > b.name ? 1 : -1));
    removeItemsFromInventory(inventory.value, vill.loves);
  };

  const changeQuantity = (name: string, value: number) => {
    const item = inventory.value.find((item) => item.name === name);
    if (item) {
      item.quantity = Math.max(0, item.quantity + value);
    }
  };

  const changeFriendship = (villager: string, amount: number) => {
    const maybeTrackedVillager = trackedVillagers.value.find((v) => v.name === villager);
    if (maybeTrackedVillager) {
      maybeTrackedVillager.friendshipPoints += amount;
    }
  };

  const itemDrop = () => {
    if (dragging.value && hovering.value) {
      changeFriendship(hovering.value, 250);
      changeQuantity(dragging.value, -1);
    }
  };

  const filterInventory = () => {
    filteredInventory.value = inventory.value.filter((item) => item.name.toLowerCase().includes(inventoryFilter.value.toLowerCase()));
  };

  watch(
    trackedVillagers,
    (newValue) => {
      localStorage.setItem('trackedVillagers', JSON.stringify(newValue));
    },
    { deep: true }
  );

  watch(
    inventory,
    (newValue) => {
      localStorage.setItem('inventory', JSON.stringify(newValue));
      filterInventory();
    },
    { deep: true }
  );

  watch(
    inventoryFilter,
    () => {
      filterInventory();
    },
    { deep: true }
  );

  watch(
    date,
    (newValue) => {
      localStorage.setItem('date', JSON.stringify(newValue));
    },
    { deep: true }
  );

  return {
    untrackedVillagers,
    trackedVillagers,
    inventory,
    inventoryFilter,
    filteredInventory,
    date,
    dragging,
    hovering,
    init,
    reset,
    addSaveFileData,
    startTracking,
    stopTracking,
    changeQuantity,
    changeFriendship,
    itemDrop
  };
});

const removeVillager = (index: number, arr: Villager[]): Villager => {
  const villager = arr[index];
  arr.splice(index, 1);
  return villager;
};

const addItemsToInventory = (inventory: Item[], itemsToAdd: Item[]): void => {
  for (const item of itemsToAdd) {
    item.quantity = 0;
    if (!inventory.some((existingItem) => existingItem.name === item.name)) {
      item.loveCount = 1;
      inventory.push(item);
    } else {
      inventory[inventory.findIndex((invItem) => invItem.name === item.name)].loveCount++;
    }
  }
};

const removeItemsFromInventory = (inventory: Item[], itemsToRemove: Item[]): void => {
  for (const item of itemsToRemove) {
    for (let i = 0; i < inventory.length; i++) {
      if (item.name === inventory[i].name) {
        if (inventory[i].loveCount === 1) {
          inventory.splice(i, 1);
        } else {
          inventory[i].loveCount--;
        }
      }
    }
  }
};
