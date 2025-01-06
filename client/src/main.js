import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/route'
import '../node_modules/flowbite-vue/dist/index.css' //flowbite css 
import VueApexCharts from "vue3-apexcharts";


createApp(App)
    .use(router)
    .use(VueApexCharts)
    .mount('#app')
