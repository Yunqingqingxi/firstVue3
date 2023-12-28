// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import Element from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(Element);
app.use(router);
app.mount('#app');

