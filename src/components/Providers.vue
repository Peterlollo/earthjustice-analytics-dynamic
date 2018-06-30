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
    <DaysAgo></DaysAgo>
    <div class='list-options'>
      <button v-on:click='toggleWhitelistedProviders' class='btn'>
        {{showWhitelistedProviders ? 'Hide' : 'Show' }} Whitelisted Providers
      </button>
      <button v-on:click='toggleUnlistedProviders' class='btn'>
        {{showUnlistedProviders ? 'Hide' : 'Show' }} Unlisted Providers
      </button>
    </div>
    <div v-show='showUnlistedProviders' class='section no-border-bottom'>
      <div class='list-header'><h2>Unlisted Providers</h2><h2>Whitelist Action</h2></div>
      <ul>
        <li v-for='provider in unlistedProviders' :key='provider'>
          <div>{{provider}}</div>
          <div>
            <button class='btn' v-on:click='beginAddingProvider(provider)'>Add</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-show='showWhitelistedProviders' class='section no-border-bottom'>
      <div class='list-header'><h2>Whitelisted Providers</h2><h2>Whitelist Action</h2></div>
      <ul>
        <li v-for='provider in whitelistedProviders' :key='provider'>
          <div>{{provider}}</div>
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

export default {
  name: 'Providers',
  components: { DaysAgo },
  data: () => {
    return {
      showUnlistedProviders: false,
      showWhitelistedProviders: false
    }
  },
  computed: {
    pollingMsg () {
      return this.polling ? 'Still fetching more provider data...' : ''
    },
    unlistedProviders () {
      return this.providers.filter((p) => !this.whitelist[p])
    },
    whitelistedProviders () {
      return Object.keys(this.whitelist).sort()
    },
    ...mapState({
      providers: state => state.report.providers,
      fetchingData: state => state.report.fetchingData,
      whitelist: state => state.whitelist.whitelist,
      fetchingWhitelistData: state => state.whitelist.fetchingData,
      providerDataError: state => state.report.error,
      whitelistDataError: state => state.whitelist.error,
      polling: state => state.report.polling
    })
  },
  methods: {
    beginAddingProvider (provider) {
      this.setProviderToAdd(provider)
      this.openModal()
    },
    toggleWhitelistedProviders () {
      this.showWhitelistedProviders = !this.showWhitelistedProviders
    },
    toggleUnlistedProviders () {
      this.showUnlistedProviders = !this.showUnlistedProviders
    },
    getWhitelistOrProviderData () {
      if (this.providerDataError) {
        this.getReportData()
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
      'setProviderToAdd'
    ])
  },
  created () {
    if (!this.providers.length) { // no provider data in store
      this.getReportData()
    }
    if (!Object.keys(this.whitelist).length) { // no whitelist data in store
      this.getWhitelistData()
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
