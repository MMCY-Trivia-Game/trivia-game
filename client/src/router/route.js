import { createRouter, createWebHistory } from 'vue-router'
import PlayerGame from "./components/playerComponent/PlayerGame.vue";
import Leaderboard from '@/components/leaderboard/Leaderboard.vue';
const routes = [
  {
    path: "/admin",
    name: "adminLayout",
    component: () => import("@/layout/AdminLayout/AdminLayout.vue"),
  },
  {
    path: "/games",
    name: "PlayerGame",
    component: () => import("../components/playerComponent/PlayerGame.vue"),
  },
  {
    path: "/games",
    name: "PlayerGame",
    component: () => import("@/components/playerComponent/PlayerGame.vue"),
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: () => import("../components/leaderboard/Leaderboard.vue"),
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'text-primary'
})


export default router