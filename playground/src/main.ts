import { createApp } from 'vue';
import App from './App.vue';
import { vFlickerlessSaving } from '@flickerless/vue';
import '@flickerless/core/styles.css';
import './style.css';

const app = createApp(App);
app.directive('flickerless-saving', vFlickerlessSaving);
app.mount('#app');
