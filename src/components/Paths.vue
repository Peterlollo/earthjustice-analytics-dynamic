<template>
  <div>

    <!-- FETCHING DATA -->
    <div v-if='fetchingPathData || fetchingWhitelistData' class='section no-border-bottom'>
      <h1>Fetching data...</h1>
    </div>

    <!-- NETWORK FAILURE -->
    <div v-else-if='pathError || whitelistError' class='section'>
      <h1>Sorry, there was an error retrieving data from server</h1>
      <button v-on:click='getPathData' class='btn'>Fetch Data</button>
    </div>

    <!-- STILL POLLING FOR DATA, NO NETWORK FAILURE, NO PARAM FAILURE, AND PATH NOT FOUND IN STORE -->
    <div v-else-if='pollingPaths && pathFromParamStatus === "success" && !pathFoundInStore' class='section no-border-bottom'>
      <h1 class='polling'>Data is loading</h1>
    </div>

    <!-- NO NETWORK FAILURE, NO PARAM FAILURE, BUT PATH NOT FOUND IN STORE -->
    <div v-else-if='pathFromParamStatus === "success" && !pathFoundInStore' class='section no-border-bottom'>
      <h1>Sorry, could not find that page path</h1>
      <p>{{ pathMsgError }}</p>
      <p>Or, try re-fetching the Google Analytics data</p>
      <button v-on:click='getPathData' class='btn'>Fetch Data</button>
    </div>

    <!-- NO NETWORK FAILURE, BUT FAILURE WITH URL PARAM -->
    <div v-else-if='pathFromParamStatus === "fail"' class='section no-border-bottom'>
      <h1>Something's wrong with the URL's "path" parameter</h1>
      <p>{{ pathMsgError }}</p>
    </div>

    <!-- NETWORK/PARAM/PATH_IN_STORE SUCCESS -->
    <div v-else-if='pathFromParamStatus === "success" && pathFoundInStore'>
      <div v-if='pollingPaths'>
        <h1 class='polling'>Data is loading</h1>
      </div>
      <div class='section no-border-bottom'>
        <h2 class='no-font-weight'>Page</h2>
        <p class='page-title'>{{pathFromParam}}</p>
        <div class='days-ago'>
          <h2 class='no-font-weight'>Showing data from the last {{daysAgo}} days</h2>
          <button v-on:click='toggleDaysAgoInput' class='btn'>{{daysAgoBtnMsg}}</button>
          <div v-show='showDaysAgoInput' class='change-days-ago'>
            <label>From how many days back do you want to fetch data?</label>
            <input type='number' min='1' v-model='newDaysAgo' placeholder='Example: 10'/>
            <button v-on:click='setRangeAndFetchData()' class='btn'>Fetch Data</button>
          </div>
        </div>
      </div>
      <div v-if='keySectorsSortedByProviderCount.length' class='section'>
        <div class='list-header'><h2>Key Sectors</h2><h2>Count</h2></div>
        <ul>
          <li v-for='sector in keySectorsSortedByProviderCount' :key='sector'>
            <div>{{sector}}</div><div>{{keyProvidersBySector[sector].length}}</div>
          </li>
        </ul>
      </div>
      <h2 v-else>No page views by whitelisted providers</h2>

      <div v-for='sector in keySectorsSortedByProviderCount' :key='sector'>
        <div class='section'>
          <div class='list-header'><h2>{{sector}}</h2><h2>Seconds</h2></div>
          <ul>
            <li v-for='provider in keyProvidersBySectorSortedBySession[sector]' :key='provider'>
              <div>{{provider}}</div><div>{{sessionsByKeyProviders[provider].reduce((a, v) => a + v)}}</div>
            </li>
          </ul>
        </div>
      </div>

      <div class='section'>
        <div class='list-header'><h2>Unlisted Providers</h2><h2>Seconds</h2></div>
        <ul>
          <li v-for='provider in unlistedProvidersSortedBySession' :key='provider'>
            <div>{{provider}}</div><div>{{providerSessions[provider].reduce((a, v) => a + v)}}</div>
          </li>
        </ul>
      </div>
    </div>

  </div>

</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  data: () => {
    return {
      pathMsgError: 'Try editing the URL in your browser\'s address bar to search for a new path.',
      daysAgoBtnMsg: 'Edit',
      showDaysAgoInput: false,
      newDaysAgo: ''
    }
  },
  name: 'Paths',
  computed: {
    ...mapState({
      pollingPaths: state => state.path.pollingPaths,
      daysAgo: state => state.path.googleAnalyticsDaysAgo
    }),
    ...mapGetters([
      'path',
      'pathFromParam',
      'pathFromParamStatus',
      'fetchingPathData',
      'pathFoundInStore',
      'pathError',
      'whitelist',
      'keyProvidersBySector',
      'sessionsByKeyProviders',
      'keyProvidersBySectorSortedBySession',
      'keySectorsSortedByProviderCount',
      'fetchingWhitelistData',
      'whitelistError',
      'providerSessions',
      'unlistedProvidersSortedBySession'
    ])
  },
  methods: {
    setRangeAndFetchData () {
      this.toggleDaysAgoInput()
      this.setDaysAgo(this.newDaysAgo)
      this.getPathData()
    },
    toggleDaysAgoInput () {
      this.daysAgoBtnMsg = this.showDaysAgoInput ? 'Edit' : 'Hide'
      this.showDaysAgoInput = !this.showDaysAgoInput
    },
    ...mapActions([
      'getPathData',
      'getPathFromParam',
      'getWhitelistData',
      'setDaysAgo'
    ])
  },
  created () {
    if (!Object.keys(this.whitelist).length) { // no whitelist data in store
      this.getWhitelistData()
    }
    if (!this.path) { // no path data in store
      this.getPathData()
    } else {
      this.getPathFromParam()
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
