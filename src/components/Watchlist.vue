<template>
  <!-- FETCHING DATA -->
  <div v-if='fetchingWatchlistData' class='section no-border-bottom'>
    <h1 class='polling'>Fetching data...</h1>
  </div>

  <!-- NETWORK FAILURE -->
  <div v-else-if='providerDataError || watchlistDataError' class='section'>
    <h1>Sorry, there was an error retrieving data from server</h1>
    <button v-on:click='getWatchlistOrProviderData' class='btn'>Fetch Data</button>
  </div>

  <!-- WATCHLIST AND PROVIDER DATA SUCCESS -->
  <div v-else class='section no-border-bottom'>
    <h2 class='polling'>{{ pollingMsg }}</h2>
    <div>
      <h1 class='page-title'>Watchlist</h1>
      <DaysAgo :filter='false'></DaysAgo>
      <ul>
        <li v-for='provider in watchlist' :key='provider'>
          <span v-on:click='showProviderPages(provider)' class='provider-name'>{{provider}}</span>
          <img v-on:click='removeProvider(provider)' class='star size' src='../assets/star-gold.png' alt='star' />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import DaysAgo from './DaysAgo'
export default {
  name: 'Watchlist',
  components: {DaysAgo},
  data: () => {
    return {
    }
  },
  computed: {
    pollingMsg () {
      return this.polling ? 'Still fetching more provider data...' : ''
    },
    ...mapState({
      watchlist: state => state.watchlist.watchlist,
      providers: state => state.report.providers,
      fetchingWatchlistData: state => state.watchlist.fetchingData,
      providerDataError: state => state.report.error,
      polling: state => state.report.polling,
      watchlistDataError: state => state.watchlist.error
    })
  },
  methods: {
    showProviderPages (provider) {
      this.viewProviderPages(provider)
      this.openModal('providerPages')
    },
    removeProvider (provider) {
      this.setWatchlistProviderToAddOrRemove(provider)
      this.watchlistRemoveProvider(provider)
    },
    getWatchlistOrProviderData () {
      if (this.providerDataError) {
        this.getReportData({filter: false})
      }
      if (this.watchlistDataError) {
        this.getWatchlistData()
      }
    },
    ...mapActions([
      'watchlistRemoveProvider',
      'setWatchlistProviderToAddOrRemove',
      'getReportData',
      'getWatchlistData',
      'openModal',
      'viewProviderPages'
    ])
  },
  created () {
    if (!this.providers.length) { // no provider data in store
      this.getReportData({filter: false})
    }
    if (!this.watchlist.length) { // no watchlist data in store
      this.getWatchlistData()
    }
  }
}
</script>

<style scoped>
/* SECTIONS */
/**********/
.section {
  margin-top: 60px;
  padding-bottom: 60px;
  margin-bottom: 60px;
  border-bottom: solid 2px black;
}
.no-border-bottom {
  border-bottom-color: transparent;
}
/* LIST */
/**********/
li {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
li:last-of-type {
  border-bottom: none;
}
/* Providers */
/**********/
.provider-name:hover {
  cursor: pointer;
}
.size {
  height: 30px;
  width: 30px;
  margin-bottom: -5px;
  margin-left: 10px;
}
.star {
  cursor: pointer;
}
/* TITLES */
/**********/
.polling {
  min-height: 35px;
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
.page-title {
  font-weight: 700;
  font-size: 5rem;
  margin: 0;
  margin-top: 35px;
}
@media (max-width: 767px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
