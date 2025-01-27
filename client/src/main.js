import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/route'
import { createPinia } from 'pinia';
import '../node_modules/flowbite-vue/dist/index.css' //flowbite css 
import VueApexCharts from "vue3-apexcharts";
import axios from 'axios'

const pinia = createPinia();
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

createApp(App)
    .use(router)
    .use(pinia)
    .use(VueApexCharts)
    .mount('#app')





