<template>
  <div v-if='fetchingProviderData || fetchingWhitelistData' class='section'>
    <h1>Fetching data...</h1>
  </div>
  <div v-else class='section no-border-bottom'>
    <h1 class='page-title'>Providers</h1>
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
            <button class='btn' v-on:click='whitelistAddProvider({name: provider, sector: null})'>Add</button>
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
      showWhitelistedProviders: false
    }
  },
  computed: {
    unlistedProviders () {
      return this.providers.filter((p) => !this.whitelist[p])
    },
    whitelistedProviders () {
      return this.providers.filter((p) => this.whitelist[p])
    },
    ...mapState({
      providers: state => state.provider.providers,
      fetchingProviderData: state => state.provider.fetchingData,
      whitelist: state => state.whitelist.whitelist,
      fetchingWhitelistData: state => state.whitelist.fetchingData
    })
  },
  methods: {
    toggleWhitelistedProviders () {
      this.showWhitelistedProviders = !this.showWhitelistedProviders
    },
    toggleUnlistedProviders () {
      this.showUnlistedProviders = !this.showUnlistedProviders
    },
    ...mapActions([
      'whitelistAddProvider',
      'whitelistRemoveProvider',
      'getProviderData',
      'getWhitelistData'
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
/* TITLES */
/**********/
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
