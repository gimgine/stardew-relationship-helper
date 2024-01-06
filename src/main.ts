import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';

import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';

const app = createApp(App);
const pinia = createPinia();

import { faXmark, faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { faApple, faWindows } from '@fortawesome/free-brands-svg-icons';
library.add(faXmark, faCakeCandles, faApple, faWindows);

app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
