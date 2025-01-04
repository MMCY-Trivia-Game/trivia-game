import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/admin',
        name: 'adminLayout',
        component: () => import('@/layout/AdminLayout/AdminLayout.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'text-primary'
})


export default router