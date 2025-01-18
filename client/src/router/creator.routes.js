
import TestGameFlow from '../components/TestGameFlow.vue';
import CreateGameView from '../views/creator/CreateGameView.vue';

export const creatorRoutes = [
  {
    path: '/creator/test',
    name: 'testGame',
    component: TestGameFlow
  },
  {
    path: '/creator/create',
    name: 'createGame',
    component: CreateGameView
  }
]; 