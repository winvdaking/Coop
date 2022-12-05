import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

import App from './App.vue';
import router from './router';
import './assets/main.css';

const $App = createApp(App);

$App.use(pinia);
$App.use(router);

$App.mount('#app');
