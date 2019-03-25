<template>
  <div class='section no-border-bottom'>
    <h1 class='page-title'>Earthjustice Web Analytics</h1>
    <a v-on:click='changeRoute("/providers")'><button class='btn'>Providers</button></a>
    <a v-on:click='changeRoute("/pages?path=earthjustice.org")'><button class='btn'>Pages</button></a>
    <a v-on:click='changeRoute("/watchlist")'><button class='btn'>Watchlist</button></a>
  </div>
</template>

<script>
import Router from '../router'
import { mapActions } from 'vuex'
export default {
  name: 'Home',
  methods: {
    changeRoute (route) {
      Router.push(route)
    },
    ...mapActions([
      'getReportData'
    ])
  },
  created () {
    this.getReportData()
  }
}
</script>

<style scoped>
.section {
  margin-top: 60px;
  padding-bottom: 60px;
  margin-bottom: 60px;
  border-bottom: solid 2px black;
}
.no-border-bottom {
  border-bottom-color: transparent;
}
.page-title {
  font-weight: 700;
  font-size: 5rem;
  margin: 0;
}
@media (max-width: 767px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
