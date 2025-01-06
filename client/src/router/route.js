import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/admin',
        name: 'adminLayout',
        redirect: 'admin/dashboard',
        component: () => import('@/layout/AdminLayout/AdminLayout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/pages/admin/Dashboard.vue')
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('@/pages/admin/Users.vue')
            },
            {
                path: 'games',
                name: 'games',
                component: () => import('@/pages/admin/Games.vue')
            },
            {
                path: 'setting',
                name: 'setting',
                component: () => import('@/pages/admin/Setting.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'text-highlight'
})


export default router