import Vue from 'vue';
import Router from 'vue-router';
import AllTeams from '@/components/AllTeams';
import TeamInfo from '@/components/TeamInfo';
import PlayerInfo from '@/components/PlayerInfo';
import NotFound from '@/components/NotFound';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: AllTeams
    },
    {
      path: '/teams/:id',
      name: 'team information',
      component: TeamInfo
    },
    {
      path: '/teams/:team/:id',
      name: 'player information',
      component: PlayerInfo
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
    // put your vue routes here
  ]
});
