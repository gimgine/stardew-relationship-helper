<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} - Yay!</template>
  </metainfo>
  <router-view />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useStore } from './store';
import { useMeta } from 'vue-meta';

const store = useStore();

useMeta({
  title: 'Stardew Relationship Helper',
  meta: {
    vmid: 'description', // vmid helps to update the tag if the component is re-rendered
    name: 'description',
    content:
      'Enhance your Stardew Valley gameplay with Stardew Relationship Helper. Track villagers, manage loved gifts, and optimize relationships with a dynamic inventory and gift-giving system.'
  }
});

onMounted(() => {
  store.init();
});
</script>
