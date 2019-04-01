<template>
  <div>

    <!-- FETCHING DATA -->
    <!-- TODO: fetchingPathData not currently being used. Should it? -->
    <div v-if='fetchingPathData || fetchingWhitelistData' class='section no-border-bottom'>
      <h1>Fetching data...</h1>
    </div>

    <!-- NETWORK FAILURE -->
    <div v-else-if='pathError || whitelistError' class='section'>
      <h1>Sorry, there was an error retrieving data from server</h1>
      <button v-on:click='getReportData' class='btn'>Fetch Data</button>
    </div>

    <!-- STILL POLLING FOR DATA, NO NETWORK FAILURE, NO PARAM FAILURE, BUT NO PROVIDERS IN STORE -->
    <!-- <div v-else-if='polling && pathFromParamStatus === "success" && !providers.length' class='section no-border-bottom'>
      <h1 class='polling'>Data is loading</h1>
    </div> -->

    <!-- NO NETWORK FAILURE, NO PARAM FAILURE, BUT PATH NOT FOUND IN STORE -->
    <!-- <div v-else-if='pathFromParamStatus === "success" && !pathFoundInStore' class='section no-border-bottom'>
      <h1>Sorry, could not find that page path</h1>
      <p>{{ pathMsgError }}</p>
      <p>Or, try re-fetching the Google Analytics data</p>
      <button v-on:click='getReportData' class='btn'>Fetch Data</button>
    </div> -->

    <!-- NO NETWORK FAILURE, BUT FAILURE WITH URL PARAM -->
    <div v-else-if='pathFromParamStatus === "fail"' class='section no-border-bottom'>
      <h1>Something's wrong with the URL's "path" parameter</h1>
      <p>{{ pathMsgError }}</p>
    </div>

    <!-- NETWORK/PARAM/PATH_IN_STORE SUCCESS -->
    <div v-else-if='pathFromParamStatus === "success"'>
      <div v-if='polling'>
        <h1 class='polling'>Data is loading</h1>
      </div>
      <div class='no-border-bottom top-section'>
        <h2 class='no-font-weight'>Page</h2>
        <p class='page-title'>{{pathFromParam}}</p>
        <DaysAgo></DaysAgo>
      </div>

      <div v-if='keySectorsSortedByProviderCountWithPathFilter.length' class='section'>
        <div class='list-header'><h2>Key Sectors</h2><h2>Count</h2></div>
        <ul>
          <!--Hide Universities, colleges and k12 as per request by Christian Anthony at Earthjustice-->
          <li v-for='sector in keySectorsSortedByProviderCountWithPathFilter' :key='sector' v-if='notSchool(sector)'>
            <div>{{sector}}</div><div>{{keyProvidersBySectorWithPathFilter[sector].length}}</div>
          </li>
        </ul>
      </div>
      <h2 v-else>No page views by whitelisted providers</h2>

      <!--Hide Universities, colleges and k12 as per request by Christian Anthony at Earthjustice-->
      <div v-for='sector in keySectorsSortedByProviderCountWithPathFilter' :key='sector' v-if='notSchool(sector)'>
        <div class='section'>
          <div class='list-header'><h2>{{sector}}</h2><h2>Seconds</h2></div>
          <ul>
            <li v-for='provider in keyProvidersBySectorSortedBySessionTimesWithPathFilter[sector]' :key='provider'>
              <div class='provider'>
                <div class='provider-name' v-on:click='viewProviderPages(provider)'>{{provider}}</div>
                <WatchlistStars v-bind:provider='provider'></WatchlistStars>
              </div>
              <div>{{ getSeconds(sessionsByKeyProvidersWithPathFilter[provider]) }}</div>
            </li>
          </ul>
        </div>
      </div>

      <div class='section'>
        <div class='list-header'><h2>Unlisted Providers</h2><h2>Seconds</h2></div>
        <ul>
          <li v-for='provider in unlistedProvidersSortedBySessionTimesWithPathFilter' :key='provider'>
            <div class='provider'>
              <div class='provider-name' v-on:click='viewProviderPages(provider)'>{{provider}}</div>
              <WatchlistStars v-bind:provider='provider'></WatchlistStars>
            </div>
            <div>{{ getSeconds(providerSessionsWithPathFilter[provider]) }}</div>
          </li>
        </ul>
      </div>
    </div>

  </div>

</template>

<script>
import DaysAgo from './DaysAgo'
import { mapGetters, mapActions, mapState } from 'vuex'
import WatchlistStars from './WatchlistStars'
export default {
  data: () => {
    return {
      pathMsgError: 'Try editing the URL in your browser\'s address bar to search for a new path.',
      schools: ['Universities and Colleges', 'K-12 Schools']
    }
  },
  components: { DaysAgo, WatchlistStars },
  name: 'Paths',
  computed: {
    ...mapState({
      polling: state => state.report.polling
    }),
    ...mapGetters([
      'providers',
      'path',
      'pathFromParam',
      'pathFromParamStatus',
      'fetchingPathData',
      'pathError',
      'whitelist',
      'keyProvidersBySectorWithPathFilter',
      'sessionsByKeyProvidersWithPathFilter',
      'keyProvidersBySectorSortedBySessionTimesWithPathFilter',
      'keySectorsSortedByProviderCountWithPathFilter',
      'fetchingWhitelistData',
      'whitelistError',
      'providerSessionsWithPathFilter',
      'unlistedProvidersSortedBySessionTimesWithPathFilter'
    ])
  },
  methods: {
    getSeconds (object) {
      let pathWithSlash = `${this.path}/`
      return object[this.path] || object[pathWithSlash]
    },
    toggleAllProviders () {
      this.allProviders = !this.allProviders
    },
    notSchool (sector) {
      return this.schools.indexOf(sector) === -1
    },
    getPath () {
      let parsedUrl = new URL(window.location.href)
      return parsedUrl.searchParams.get('path')
    },
    ...mapActions([
      'getReportData',
      'getPathFromParam',
      'getWhitelistData',
      'viewProviderPages'
    ])
  },
  created () {
    let path = this.getPath()
    if (this.pathFromParam !== path && `${this.pathFromParam}/` !== path) {
      // path in store is different than current url path
      this.getReportData()
      this.getPathFromParam() // put current path into store
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
.top-section {
  margin-top: 60px;
  margin-bottom: 0;
  padding-bottom: 0;
}
/* PROVIDERS */
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
  overflow-wrap: break-word;
}
/* List Items */
/**************/
.list-header, li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
ul {
  font-size: 16px;
}
li {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
/* HTML Elements */
/**************/
.no-font-weight {
  font-weight: normal;
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
a {
  cursor: pointer;
}
@media (max-width: 767px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
