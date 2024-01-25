import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { HomeViewOption } from '@/models';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/tracker'
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
