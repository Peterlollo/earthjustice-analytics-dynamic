<template>
  <!-- FETCHING DATA -->
  <div v-if='fetchingProviderData || fetchingWhitelistData' class='section no-border-bottom'>
    <h1 class='polling'>Fetching data...</h1>
  </div>

  <!-- NETWORK FAILURE -->
  <div v-else-if='providerDataError || whitelistDataError' class='section'>
    <h1>Sorry, there was an error retrieving data from server</h1>
    <button v-on:click='getWhitelistOrProviderData' class='btn'>Fetch Data</button>
  </div>

  <!-- WHITELIST AND PROVIDER DATA SUCCESS -->
  <div v-else class='section no-border-bottom'>
    <h2 class='polling'>{{ pollingProvidersMsg }}</h2>
    <h1 class='page-title'>Providers</h1>
    <div class='days-ago'>
      <h2 class='no-font-weight'>Showing data from the last {{daysAgo}} days</h2>
      <button v-on:click='toggleDaysAgo' class='btn'>{{daysAgoBtnMsg}}</button>
      <div v-show='showDaysAgo' class='change-days-ago'>
        <label>From how many days back do you want to fetch data?</label>
        <input type='number' min='1' v-model='newDaysAgo' placeholder='Example: 10'/>
        <button v-on:click='setDaysAgoAndFetchData()' class='btn'>Fetch Data</button>
      </div>
    </div>
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
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Providers',
  data: () => {
    return {
      showUnlistedProviders: false,
      showWhitelistedProviders: false,
      daysAgoBtnMsg: 'Edit',
      showDaysAgo: false,
      newDaysAgo: ''
    }
  },
  computed: {
    pollingProvidersMsg () {
      return this.pollingProviders ? 'Still fetching more provider data...' : ''
    },
    unlistedProviders () {
      return this.providers.filter((p) => !this.whitelist[p])
    },
    whitelistedProviders () {
      return Object.keys(this.whitelist).sort()
    },
    ...mapState({
      providers: state => state.provider.providers,
      fetchingProviderData: state => state.provider.fetchingData,
      whitelist: state => state.whitelist.whitelist,
      fetchingWhitelistData: state => state.whitelist.fetchingData,
      providerDataError: state => state.provider.error,
      whitelistDataError: state => state.whitelist.error,
      pollingProviders: state => state.provider.pollingProviders,
      daysAgo: state => state.path.googleAnalyticsDaysAgo
    })
  },
  methods: {
    setDaysAgoAndFetchData () {
      this.toggleDaysAgo()
      this.setDaysAgo(this.newDaysAgo)
      this.getProviderData()
    },
    toggleDaysAgo () {
      this.daysAgoBtnMsg = this.showDaysAgo ? 'Edit' : 'Hide'
      this.showDaysAgo = !this.showDaysAgo
    },
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
        this.getProviderData()
      }
      if (this.whitelistDataError) {
        this.getWhitelistData()
      }
    },
    ...mapActions([
      'whitelistAddProvider',
      'whitelistRemoveProvider',
      'getProviderData',
      'getWhitelistData',
      'openModal',
      'setProviderToAdd',
      'setDaysAgo'
    ])
  },
  created () {
    if (!this.providers.length) { // no provider data in store
      this.getProviderData()
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
/* DAYS AGO SECTION */
/**********/
.days-ago {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.days-ago .btn {
  max-width: 200px;
}
.days-ago .change-days-ago {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.change-days-ago input {
  min-width: 200px;
}
.change-days-ago label {
  font-size: 2rem;
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
