<template lang="">
  <div class="p-3 grid grid-cols-6 gap-x-5 gap-y-2">
    <div class="col-span-6 flex mb-1">
      <img :src="seasonIcons[store.date.season]" class="rounded w-[15%] ml-2" />
      <span class="font-bold flex items-center ml-3">{{ weekdays[(store.date.day - 1) % 7] }}</span>
    </div>
    <span class="text-base col-span-4 pl-2">Season</span>
    <span class="text-base col-span-2 pl-2">Day</span>
    <select class="select w-full col-span-4" v-model="store.date.season">
      <option>{{ Season.SPRING }}</option>
      <option>{{ Season.SUMMER }}</option>
      <option>{{ Season.FALL }}</option>
      <option>{{ Season.WINTER }}</option>
    </select>
    <input
      placeholder="Day"
      class="input w-full col-span-2"
      :value="store.date.day"
      @input="
        (e: any) => {
          if (!isNaN(e.target?.value) && e.target?.value !== '') {
            e.target.value = store.date.day = Math.min(28, Math.max(1, parseInt(e.target?.value)));
          } else if (e.target?.value !== '') {
            e.target.value = store.date.day;
          }
        }
      "
      @focusout="
        (e: any) => {
          if (e.target.value === '') e.target.value = store.date.day = 1;
        }
      "
    />

    <div class="col-span-6 text-center">
      <button class="btn btn-primary btn-block mt-2" @click="nextDay">Next Day</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { Season } from '@/models';

const store = useStore();

const seasonIcons = {
  Spring: 'https://stardewvalleywiki.com/mediawiki/images/thumb/9/9c/Spring.png/24px-Spring.png',
  Summer: 'https://stardewvalleywiki.com/mediawiki/images/thumb/8/85/Summer.png/24px-Summer.png',
  Fall: 'https://stardewvalleywiki.com/mediawiki/images/thumb/5/5d/Fall.png/24px-Fall.png',
  Winter: 'https://stardewvalleywiki.com/mediawiki/images/thumb/a/a7/Winter.png/24px-Winter.png'
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const nextDay = () => {
  if (store.date.day === 28) {
    store.date.season = Object.values(Season)[(Object.values(Season).indexOf(store.date.season) + 1) % 4];
    store.date.day = 1;
  } else {
    store.date.day += 1;
  }
};
</script>
