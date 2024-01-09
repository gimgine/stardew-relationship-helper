import { defineStore } from 'pinia';
import data from './data.json';
import { type Item, type Villager, type StardewDate, Season, Quality } from '@/models/index';
import { ref, watch, computed } from 'vue';

export const useStore = defineStore('store', () => {
  const villagers = ref<Villager[]>([]);
  const untrackedVillagers = computed(() => {
    return villagers.value.filter((v: Villager) => !v.isTracking);
  });
  const trackedVillagers = computed(() => {
    return villagers.value.filter((v: Villager) => v.isTracking);
  });
  const inventory = ref<Item[]>([]);
  const inventoryFilter = ref<string>('');
  const filteredInventory = ref<Item[]>([]);
  const date = ref<StardewDate>({} as StardewDate);
  const itemDragging = ref<string>('');
  const nameHovering = ref<string>('');

  const init = () => {
    data.forEach((villager) => villager.loves.sort((item1, item2) => (item1.name > item2.name ? 1 : -1)));

    const localVillagers = localStorage.getItem('localVillagers');
    if (localVillagers) {
      villagers.value = JSON.parse(localVillagers) as Villager[];
    } else {
      villagers.value = data as Villager[];
    }

    const localInventory = localStorage.getItem('inventory');
    inventory.value = localInventory ? JSON.parse(localInventory) : [];

    const localDate = localStorage.getItem('date');
    date.value = localDate ? JSON.parse(localDate) : { season: Season.SPRING, day: 1 };
  };

  const reset = () => {
    data.forEach((villager) => villager.loves.sort((item1, item2) => (item1.name > item2.name ? 1 : -1)));
    villagers.value = data as Villager[];
    inventory.value = [];
    date.value = { season: Season.SPRING, day: 1 };
  };

  const addSaveFileData = (friendshipData: [{ name: string; friendshipPoints: number; status: string }], saveFileDate: StardewDate) => {
    villagers.value.forEach((v: Villager) => {
      const data = friendshipData.find((villager) => villager.name === v.name);
      if (data) {
        v.friendshipPoints = data.friendshipPoints;
      }
    });
    date.value = saveFileDate;
  };

  const startTracking = (name: string) => {
    const vill: Villager | undefined = untrackedVillagers.value.find((v) => v.name === name);
    if (vill) {
      if (!vill.friendshipPoints) vill.friendshipPoints = 0;
      vill.isTracking = true;
      addItemsToInventory(inventory.value, vill.loves);
    } else {
      console.error(`Could not start tracking ${name}.`);
    }
  };

  const stopTracking = (name: string) => {
    const vill: Villager | undefined = trackedVillagers.value.find((v) => v.name === name);
    if (vill) {
      vill.isTracking = false;
      removeItemsFromInventory(inventory.value, vill.loves);
    } else {
      console.error(`Could not stop tracking ${name}.`);
    }
  };

  const changeQuantity = (name: string, value: number) => {
    const item = inventory.value.find((item) => item.name === name);
    if (item) {
      item.quantity = Math.max(0, item.quantity + value);
    }
  };

  const getFriendshipPointAmount = (villager: Villager, quality: Quality = Quality.NORMAL): number => {
    let amount = 80;

    if (villager.birthday.season === date.value.season && villager.birthday.day === date.value.day) {
      amount *= 8;
    } else if (date.value.season === Season.WINTER && date.value.day === 25) {
      amount *= 5;
    }

    return (amount *= quality);
  };

  const changeFriendship = (name: string) => {
    const villager = trackedVillagers.value.find((v) => v.name === name);
    if (villager) {
      villager.friendshipPoints += getFriendshipPointAmount(villager);
    }
  };

  const itemDrop = () => {
    if (itemDragging.value && nameHovering.value) {
      changeFriendship(nameHovering.value);
      changeQuantity(itemDragging.value, -1);
    }
  };

  const filterInventory = () => {
    filteredInventory.value = inventory.value.filter((item) => item.name.toLowerCase().includes(inventoryFilter.value.toLowerCase()));
  };

  watch(
    villagers,
    (newValue) => {
      localStorage.setItem('localVillagers', JSON.stringify(newValue));
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
    itemDragging,
    nameHovering,
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
