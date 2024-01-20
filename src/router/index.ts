import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { HomeViewOption } from '@/models';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: { option: HomeViewOption.DESKTOP }
    },
    {
      path: '/:option',
      name: 'option',
      component: HomeView,
      props: true
    }
  ]
});

export default router;
