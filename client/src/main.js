import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/route'
import { createPinia } from 'pinia';
import '../node_modules/flowbite-vue/dist/index.css' //flowbite css 
import VueApexCharts from "vue3-apexcharts";

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .use(VueApexCharts)
    .mount('#app')





