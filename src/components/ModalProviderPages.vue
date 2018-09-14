<template>
  <Modal>
    <template slot="body">
        <h1 class='title'>{{provider}}</h1>
        <h2 class='subtitle'>Pages</h2>
        <ul>
          <li class='path' v-for='(path, i) in paths' :key='path+i'>{{path}}</li>
        </ul>
      </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
import {mapState} from 'vuex'
export default {
  components: {Modal},
  computed: {
    ...mapState({
      provider: state => state.report.viewingProviderPagesFor,
      providerSessions: state => state.report.providerSessions,
      providerSessionsWithoutFilter: state => state.report.providerSessionsWithoutFilter,
      daysAgo: state => state.report.googleAnalyticsDaysAgo
    }),
    paths () {
      let pathname = new URL(window.location.href).pathname
      let providerSession
      if (pathname === '/pages') { // have to look through provider sessions unfiltered by path
        providerSession = this.providerSessionsWithoutFilter[this.provider]
      } else {
        providerSession = this.providerSessions[this.provider]
      }
      if (providerSession) { // check that there are any sessions available
        return providerSession.paths
      } else {
        return [`No pages were visited by this provider in the last ${this.daysAgo} days`]
      }
    }
  }
}
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 3rem;
  text-align: center;
}
.subtitle {
  font-weight: 700;
  font-size: 2rem;
}
.path {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
.path:last-of-type {
  border-bottom: none;
}
</style>
