<template>
  <!-- FETCHING DATA -->
  <div v-if='fetchingData || fetchingWhitelistData' class='section no-border-bottom'>
    <h1 class='polling'>Fetching data...</h1>
  </div>

  <!-- NETWORK FAILURE -->
  <div v-else-if='providerDataError || whitelistDataError' class='section'>
    <h1>Sorry, there was an error retrieving data from server</h1>
    <button v-on:click='getWhitelistOrProviderData' class='btn'>Fetch Data</button>
  </div>

  <!-- WHITELIST AND PROVIDER DATA SUCCESS -->
  <div v-else class='section no-border-bottom'>
    <h2 class='polling'>{{ pollingMsg }}</h2>
    <h1 class='page-title'>Providers</h1>
    <DaysAgo :filter='false'></DaysAgo>
    <div class='list-options'>
      <button v-on:click='toggleWhitelistedProviders' class='btn'>
        {{showWhitelistedProviders ? 'Hide' : 'Show' }} Whitelisted Providers
      </button>
      <button v-on:click='toggleUnlistedProviders' class='btn'>
        {{showUnlistedProviders ? 'Hide' : 'Show' }} Unlisted Providers
      </button>
    </div>
    <div v-show='showUnlistedProviders' class='section no-border-bottom'>
      <div class='list-header'><h2>Unlisted Providers</h2><h2>Whitelist</h2></div>
      <ul>
        <li v-for='provider in unlistedProviders' :key='provider'>
          <div class='provider'>
            <span class='provider-name' v-on:click='viewProviderPages(provider)'>{{provider}}</span>
            <WatchlistStars v-bind:provider='provider'></WatchlistStars>
          </div>
          <div>
            <button class='btn' v-on:click='beginAddingProvider(provider)'>Add</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-show='showWhitelistedProviders' class='section no-border-bottom'>
      <div class='whitelist-section-header'>
        <h2>Whitelisted Providers</h2>
        <div class='filter-whitelist-container'>
          <h3 class='no-font-weight'>{{whitelistMsg}}</h3>
          <button v-on:click='toggleWhitelist' class='btn'>Change</button>
        </div>
      </div>
      <div class='list-header'><h2>Providers</h2><h2>Whitelist</h2></div>
      <ul>
        <li v-for='provider in whitelistedProviders' :key='provider'>
          <div class='provider'>
            <span class='provider-name' v-on:click='viewProviderPages(provider)'>{{provider}}</span>
            <WatchlistStars v-bind:provider='provider'></WatchlistStars>
          </div>
          <div>
            <button class='btn' v-on:click='whitelistRemoveProvider({name: provider})'>Remove</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DaysAgo from './DaysAgo'
import { mapState, mapActions } from 'vuex'
import WatchlistStars from './WatchlistStars'

export default {
  name: 'Providers',
  components: { DaysAgo, WatchlistStars },
  data: () => {
    return {
      showAllWhitelist: false
    }
  },
  computed: {
    whitelistMsg () {
      return this.showAllWhitelist ? 'Showing entire Whitelist' : `Showing data from last ${this.days} days`
    },
    pollingMsg () {
      return this.polling ? 'Still fetching more provider data...' : ''
    },
    unlistedProviders () {
      return this.providers.filter((p) => !this.whitelist[p])
    },
    whitelistedProviders () {
      if (this.showAllWhitelist) {
        return Object.keys(this.whitelist).sort()
      } else {
        return Object.keys(this.whitelist).filter((p) => (this.providers.indexOf(p) > -1)).sort()
      }
    },
    ...mapState({
      providers: state => state.report.providers,
      fetchingData: state => state.report.fetchingData,
      whitelist: state => state.whitelist.whitelist,
      fetchingWhitelistData: state => state.whitelist.fetchingData,
      providerDataError: state => state.report.error,
      whitelistDataError: state => state.whitelist.error,
      polling: state => state.report.polling,
      watchlist: state => state.watchlist.watchlist,
      days: state => state.report.googleAnalyticsDaysAgo,
      showUnlistedProviders: state => state.whitelist.showUnlistedProviders,
      showWhitelistedProviders: state => state.whitelist.showWhitelistedProviders
    })
  },
  methods: {
    toggleWhitelist () {
      this.showAllWhitelist = !this.showAllWhitelist
    },
    beginAddingProvider (provider) {
      this.setProviderToAdd(provider)
      this.openModal('addProviderToWhitelist')
    },
    toggleWhitelistedProviders () {
      this.toggleProvidersLists('whitelist')
    },
    toggleUnlistedProviders () {
      this.toggleProvidersLists('unlisted')
    },
    getWhitelistOrProviderData () {
      if (this.providerDataError) {
        this.getReportData({filter: false})
      }
      if (this.whitelistDataError) {
        this.getWhitelistData()
      }
    },
    ...mapActions([
      'whitelistAddProvider',
      'whitelistRemoveProvider',
      'getReportData',
      'getWhitelistData',
      'openModal',
      'setProviderToAdd',
      'viewProviderPages',
      'getWatchlistData',
      'toggleProvidersLists'
    ])
  },
  created () {
    if (!this.providers.length) { // no provider data in store
      this.getReportData({filter: false})
    }
    if (!Object.keys(this.whitelist).length) { // no whitelist data in store
      this.getWhitelistData()
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
/* Providers */
/**********/
.provider {
  display: flex;
}
.provider-name:hover {
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
}
.list-header, li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
li {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
h1, h2 {
  font-weight: 700;
  margin: 0;
}
h1 {
  font-size: 3rem;
}
h2 {
  font-size: 2rem;
}
/* WHITELIST SECTION HEADER */
/*****************************/
.whitelist-section-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 550px;
}
/* FILTER WHITELIST CONTAINER */
/*****************************/
.filter-whitelist-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border: solid 1px #eee;
  padding: 20px;
  align-items: flex-start;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding-top: 0;
}
.filter-whitelist-container .btn {
  max-width: 130px;
}
.no-font-weight {
  font-size: 18px;
  font-weight: 400;
}
@media(max-width: 767px) {
  .filter-whitelist-container {
    width: 250px;
  }
}
/* LIST */
/*****************************/
.list-options {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.list-options > * {
  flex-basis: auto;
  margin-right: 25px;
  margin-bottom: 25px;
}
@media (max-width: 767px) {
  .page-title {
    font-size: 4rem;
  }
  .list-options {
    flex-direction: column;
    justify-content: center;
  }
  .list-options > * {
    flex-basis: auto;
  }
}
</style>
