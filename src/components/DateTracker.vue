<template>
  <div class="p-3 flex flex-wrap gap-y-2">
    <!-- Header with image and weekday -->
    <div class="flex items-center w-full">
      <img class="rounded w-[20%] ml-1" :src="seasonIcons[store.date.season]" />
      <span class="font-bold flex items-center ml-3">{{ weekdays[(store.date.day - 1) % 7] }}</span>
    </div>

    <div class="flex w-full justify-between">
      <!-- Season select -->
      <label class="form-control w-3/5 mr-2">
        <div class="label">
          <span class="label-text">Season</span>
        </div>
        <select class="select w-full" v-model="store.date.season">
          <option>{{ Season.SPRING }}</option>
          <option>{{ Season.SUMMER }}</option>
          <option>{{ Season.FALL }}</option>
          <option>{{ Season.WINTER }}</option>
        </select>
      </label>

      <!-- Day input -->
      <label class="form-control flex-1">
        <div class="label">
          <span class="label-text">Day</span>
        </div>
        <select class="select w-full" v-model.number="store.date.day">
          <option v-for="day in 28" :key="day" :value="day">{{ day }}</option>
        </select>
      </label>
    </div>

    <!-- Next Day Button -->
    <div class="w-full text-center">
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
