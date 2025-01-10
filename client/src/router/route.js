import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/creator/HomeView.vue';
import SingleGameView from '@/views/creator/SingleGameView.vue';
import CreateGameView from '@/views/creator/CreateGameView.vue';
import LeaderboardView from '@/views/creator/LeaderboardView.vue';
import GameLobbyView from '@/views/creator/GameLobbyView.vue';
import GameStartView from '@/views/creator/GameStartView.vue';
import GameReportView from '@/views/creator/GameReportView.vue';
import ProfileView from '@/views/creator/ProfileView.vue';
import FinalGameReportView from '@/views/creator/FinalGameReportView.vue';
import MyGamesView from '@/views/creator/MyGamesView.vue';
import PlayerGame from '@/components/playerComponent/PlayerGame.vue';
import Leaderboard from '@/components/leaderboard/Leaderboard.vue';
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/login.vue')
  },
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
  },
  {
    path: '/creator',
    name: 'creatorHome',
    component: HomeView,
  },
  {
    path: '/creator/profile',
    name: 'creatorProfile',
    component: ProfileView,
  },
  {
    path: '/creator/games/my',
    name: 'myGames',
    component: MyGamesView,
  },
  {
    path: '/creator/game/:id',
    name: 'singleGame',
    component: SingleGameView,
  },
  {
    path: '/creator/game/create',
    name: 'createGame',
    component: CreateGameView,
  },
  {
    path: '/creator/game/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView,
  },
  {
    path: '/creator/game/lobby',
    name: 'gameLobby',
    component: GameLobbyView,
  },
  {
    path: '/creator/game/start',
    name: 'gameStart',
    component: GameStartView,
  },
  {
    path: '/creator/game/report',
    name: 'gameReport',
    component: GameReportView,
  },
  {
    path: '/creator/game/report/final',
    name: 'finalGameReport',
    component: FinalGameReportView,
  },
  {
    path: '/games',
    name: 'PlayerGame',
    component: () => import('../components/playerComponent/PlayerGame.vue'),
  },
  {
    path: '/games',
    name: 'PlayerGame',
    component: () => import('@/components/playerComponent/PlayerGame.vue'),
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../components/leaderboard/Leaderboard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'text-primary',
});

export default router;
