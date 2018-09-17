import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Providers from '@/components/Providers'
import Paths from '@/components/Paths'
import Watchlist from '@/components/Watchlist'
import ProviderSessions from '@/components/ProviderSessions'
import NotFoundComponent from '@/components/NotFoundComponent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        main: Home
      }
    },
    {
      path: '/providers',
      name: 'providers',
      components: {
        main: Providers
      }
    },
    {
      path: '/pages',
      name: 'paths',
      components: {
        main: Paths
      }
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      components: {
        main: Watchlist
      }
    },
    {
      path: '/providersessions',
      name: 'providersessions',
      components: {
        main: ProviderSessions
      }
    },
    {
      path: '*',
      name: 'notFound',
      components: {
        main: NotFoundComponent
      }
    }
  ]
})
