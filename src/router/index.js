import Vue from 'vue'
import Router from 'vue-router'
import Dynamic from '@/components/Dynamic'
// import Provider from '@/components/Provider'
import MoreData from '@/components/MoreData'
import Providers from '@/components/Providers'
import Page from '@/components/Page'
import NotFoundComponent from '@/components/NotFoundComponent'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        // main: Provider,
        // sidebar: Providers
        main: Dynamic
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
      name: 'page',
      components: {
        main: Page
      }
    },
    {
      path: '/fetchMoreData',
      name: 'fetchMoreData',
      components: {
        main: MoreData
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
