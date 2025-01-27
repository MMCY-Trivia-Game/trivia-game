import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/creator/HomeView.vue';
import SingleGameView from '@/views/creator/SingleGameView.vue';
import CreateGameView from '@/views/creator/CreateGameView.vue';
import LeaderboardView from '@/views/creator/LeaderboardView.vue';
import RoundsView from '@/views/creator/RoundsView.vue';
import GameLobbyView from '@/views/creator/GameLobbyView.vue';
import GameStartView from '@/views/creator/GameStartView.vue';
import GameReportView from '@/views/creator/GameReportView.vue';
import ProfileView from '@/views/creator/ProfileView.vue';
import FinalGameReportView from '@/views/creator/FinalGameReportView.vue';
import MyGamesView from '@/views/creator/MyGamesView.vue';
import PlayerGame from '@/components/playerComponent/PlayerGame.vue';
import Leaderboard from '@/components/leaderboard/Leaderboard.vue';
import PlayerAnswerView from '@/views/creator/PlayerAnswerView.vue';
import PlayerJoinView from '@/views/creator/PlayerJoinView.vue';
import PlayerLobbyView from '../views/creator/PlayerLobbyView.vue';
import { useAuthStore } from '@/stores/auth/auth.js';
import { useRoute } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/auth/login.vue'),
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () => import('@/pages/auth/forget-password.vue'),
  },
  {
    path: '/password-reset-sent',
    name: 'password-reset-sent',
    component: () => import('@/pages/auth/password-reset-sent.vue'),
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('@/pages/auth/reset-password.vue'),
    beforeEnter: async (to, from) => {
      const userAuth = useAuthStore();
      const token = to.params.token;

      if (await userAuth.checkPasswordTokenValidity(token)) {
        return true;
      }
      userAuth.error =
        'Invalid or expired token. Please request a new token to continue.';
      return router.push('/');
    },
  },
  {
    path: '/admin',
    name: 'adminLayout',
    redirect: 'admin/dashboard',
    component: () => import('@/layout/AdminLayout/AdminLayout.vue'),
    beforeEnter: (to, from, next) => {
      const userAuth = useAuthStore();
      if (userAuth.accessToken) {
        if (userAuth.user.role === 'admin') {
          next();
        } else {
          next({ name: 'login', query: { redirect: to.fullPath } });
        }
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } });
      }
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/admin/Dashboard.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/admin/Users.vue'),
      },
      {
        path: 'games',
        name: 'games',
        component: () => import('@/pages/admin/Games.vue'),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/pages/admin/Setting.vue'),
      },
    ],
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
    path: '/creator/game/:id/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView,
  },
  {
    path: '/creator/game/:id/rounds',
    name: 'rounds',
    component: RoundsView,
  },
  {
    path: '/creator/game/:id/lobby',
    name: 'gameLobby',
    component: GameLobbyView,
  },
  {
    path: '/creator/game/:id/start',
    name: 'gameStart',
    component: GameStartView,
  },
  {
    path: '/creator/game/:id/report',
    name: 'gameReport',
    component: GameReportView,
  },
  {
    path: '/creator/game/:id/report/final',
    name: 'finalGameReport',
    component: FinalGameReportView,
  },
  {
    path: '/creator/game/player/test/join',
    name: 'testingPlayerJoin',
    component: PlayerJoinView,
  },
  {
    path: '/game/:id/play',
    name: 'testingPlayerAnswer',
    component: PlayerAnswerView,
  },
  {
    path: '/game/:id/lobby',
    name: 'testingPlayerLobby',
    component: PlayerLobbyView,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'text-primary',
});

export default router;
