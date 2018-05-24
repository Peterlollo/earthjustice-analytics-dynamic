import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Providers from '@/components/Providers'
import Paths from '@/components/Paths'
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
      path: '*',
      name: 'notFound',
      components: {
        main: NotFoundComponent
      }
    }
  ]
})
