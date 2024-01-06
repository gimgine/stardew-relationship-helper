<template>
  <router-view />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useStore } from './store';

const store = useStore();

onMounted(() => {
  store.init();
});
</script>
