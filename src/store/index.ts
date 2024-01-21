import { defineStore } from 'pinia';
import data from './data.json';
import { type Item, type Villager, type StardewDate, Season, Quality } from '@/models';
import { ref, watch, computed } from 'vue';

export const useStore = defineStore('store', () => {
  const date = ref<StardewDate>({} as StardewDate);

  const init = () => {
    data.forEach((villager) => villager.loves.sort((item1, item2) => (item1.name > item2.name ? 1 : -1)));

    const localVillagers = localStorage.getItem('localVillagers');
    if (localVillagers) {
      useVillagerStore().villagers = JSON.parse(localVillagers) as Villager[];
    } else {
      useVillagerStore().villagers = JSON.parse(JSON.stringify(data)) as Villager[];
    }

    const localInventory = localStorage.getItem('inventory');
    useInventoryStore().inventory = localInventory ? JSON.parse(localInventory) : [];

    const localDate = localStorage.getItem('date');
    date.value = localDate ? JSON.parse(localDate) : { season: Season.SPRING, day: 1 };
  };

  const reset = () => {
    useVillagerStore().villagers = JSON.parse(JSON.stringify(data)) as Villager[];
    useInventoryStore().inventory = [];
    date.value = { season: Season.SPRING, day: 1 };
  };

  const addSaveFileData = (friendshipData: [{ name: string; friendshipPoints: number; status: string }], saveFileDate: StardewDate) => {
    useVillagerStore().villagers.forEach((v: Villager) => {
      const data = friendshipData.find((villager) => villager.name === v.name);
      if (data) {
        v.friendshipPoints = data.friendshipPoints;
      }
    });
    date.value = saveFileDate;
  };

  const giveItem = (villager: string, item: string) => {
    useVillagerStore().changeFriendship(villager);
    useInventoryStore().changeQuantity(item, -1);
  };

  watch(
    date,
    (newValue) => {
      localStorage.setItem('date', JSON.stringify(newValue));
    },
    { deep: true }
  );

  return {
    date,
    init,
    reset,
    addSaveFileData,
    giveItem
  };
});

export const useVillagerStore = defineStore('villagerStore', () => {
  const villagers = ref<Villager[]>([]);
  const untrackedVillagers = computed(() => {
    return villagers.value.filter((v: Villager) => !v.isTracking);
  });
  const trackedVillagers = computed(() => {
    return villagers.value.filter((v: Villager) => v.isTracking);
  });

  const startTracking = (name: string) => {
    const vill: Villager | undefined = untrackedVillagers.value.find((v) => v.name === name);
    if (vill) {
      if (!vill.friendshipPoints) vill.friendshipPoints = 0;
      vill.isTracking = true;
      useInventoryStore().add(vill.loves);
    } else {
      console.error(`Could not start tracking ${name}.`);
    }
  };

  const stopTracking = (name: string) => {
    const vill: Villager | undefined = trackedVillagers.value.find((v) => v.name === name);
    if (vill) {
      vill.isTracking = false;
      useInventoryStore().remove(vill.loves);
    } else {
      console.error(`Could not stop tracking ${name}.`);
    }
  };

  const getFriendshipPointAmount = (villager: Villager, quality: Quality = Quality.NORMAL, date: StardewDate = useStore().date): number => {
    let amount = 80;

    if (villager.birthday.season === date.season && villager.birthday.day === date.day) {
      amount *= 8;
    } else if (date.season === Season.WINTER && date.day === 25) {
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

  watch(
    villagers,
    (newValue) => {
      localStorage.setItem('localVillagers', JSON.stringify(newValue));
    },
    { deep: true }
  );

  return {
    villagers,
    untrackedVillagers,
    trackedVillagers,
    startTracking,
    stopTracking,
    changeFriendship
  };
});

export const useInventoryStore = defineStore('inventoryStore', () => {
  const inventory = ref<Item[]>([]);
  const displayedInventory = computed(() => {
    return inventory.value.filter((i: Item) => i.loveCount > 0);
  });
  const inventoryFilter = ref<string>('');
  const filteredInventory = computed(() => {
    return displayedInventory.value.filter((item) => item.name.toLowerCase().includes(inventoryFilter.value.toLowerCase()));
  });

  const changeQuantity = (name: string, value: number) => {
    const item = inventory.value.find((item) => item.name === name);
    if (item) {
      item.quantity = Math.max(0, item.quantity + value);
    }
  };

  const add = (items: Item[]): void => {
    for (const item of items) {
      if (!inventory.value.some((existingItem) => existingItem.name === item.name)) {
        item.loveCount = 1;
        item.quantity = 0;
        inventory.value.push(item);
      } else {
        inventory.value[inventory.value.findIndex((invItem) => invItem.name === item.name)].loveCount++;
      }
    }
  };

  const remove = (items: Item[]): void => {
    for (const item of items) {
      for (let i = 0; i < inventory.value.length; i++) {
        if (item.name === inventory.value[i].name) {
          inventory.value[i].loveCount--;
        }
      }
    }
  };

  watch(
    inventory,
    (newValue) => {
      localStorage.setItem('inventory', JSON.stringify(newValue));
    },
    { deep: true }
  );

  return {
    inventory,
    displayedInventory,
    inventoryFilter,
    filteredInventory,
    changeQuantity,
    add,
    remove
  };
});
