import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/route'
import '../node_modules/flowbite-vue/dist/index.css' //flowbite css 



createApp(App)
    .use(router)
    .mount('#app')
