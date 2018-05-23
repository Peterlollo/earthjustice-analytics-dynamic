<template>
  <div>

    <!-- FETCHING DATA -->
    <div v-if='fetchingData' class='section'>
      <h1>Fetching data...</h1>
    </div>

    <!-- NETWORK FAILURE -->
    <div v-else-if='error' class='section'>
      <h1>Sorry, there was an error retrieving data from server</h1>
      <button v-on:click='getDataDynamic'>Fetch Data</button>
    </div>

    <!-- NO NETWORK FAILURE, NO PARAM FAILURE, BUT PATH NOT FOUND IN STORE -->
    <div v-else-if='pathFromParamStatus === "success" && !pathFoundInStore' class='section'>
      <h1>Sorry, could not find that page path</h1>
      <p>{{ pathMsgError }}<a>{{ pathMsgErrorLink }}</a></p>
      <p>Or, try fetching the Google Analytics data</p>
      <button v-on:click='getDataDynamic'>Fetch Data</button>
    </div>

    <!-- NO NETWORK FAILURE, BUT FAILURE WITH URL PARAM -->
    <div v-else-if='pathFromParamStatus === "fail"'>
      <h1>Something's wrong with the URL's "path" parameter</h1>
      <p>{{ pathMsgError }}<a>{{ pathMsgErrorLink }}</a></p>
    </div>

    <!-- NETWORK/PARAM/PATH_IN_STORE SUCCESS -->
    <div v-else-if='pathFromParamStatus === "success" && pathFoundInStore'>
      <div class='section no-border-bottom'>
        <h2 class='no-font-weight'>Page</h2>
        <p class='page-title'>{{pathFromParam}}</p>
      </div>
      <div class='section'>
        <div class='list-header'><h2>Key Sectors</h2><h2>Count</h2></div>
        <ul>
          <li v-for='sector in keySectorsSortedByProviderCount' :key='sector'>
            <div>{{sector}}</div><div>{{keyProvidersBySector[sector].length}}</div>
          </li>
        </ul>
      </div>

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

      <!-- <div class='section'>
        <div class='list-header'><h2>Key Providers</h2><h2>Seconds</h2></div>
        <ul>
          <li v-for='provider in Object.keys(sessionsByKeyProviders)' :key='provider'>
            <div>{{provider}}</div><div>{{sessionsByKeyProviders[provider].reduce((a, v) => a + v)}}</div>
          </li>
        </ul>
      </div> -->
      <!-- <div class='section'>
        <div class='list-header'><h2>All Providers</h2><h2>Seconds</h2></div>
        <ul>
          <li v-for='provider in allProviders' :key='provider'>
            <div>{{provider}}</div><div>{{page[provider].reduce((a, v) => a + v)}}</div>
          </li>
        </ul>
      </div> -->
      <!-- <div class='section'>
        <h2>Page</h2>
        {{ page }}
      </div> -->
    </div>

  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      pathMsgError: 'Try editing the URL in your browser\'s address bar to search for a new path. Sometimes the "path" parameter requires a "/" at the end. For example:',
      pathMsgErrorLink: 'http://ej-analytics-prototype.herokuapp.com/pages?path=earthjustice.org/'
    }
  },
  name: 'Page',
  computed: {
    // allProviders () {
    //   return Object.keys(this.page)
    // },
    // keyProviders () {
    //   return this.allProviders.filter((p) => this.whitelist[p])
    // },
    // keySectors () {
    //   let sectors = {}
    //   this.keyProviders.map((kp) => {
    //     let sector = this.whitelist[kp].sector
    //     sectors[sector] = sectors[sector] + 1 || 1
    //   })
    //   return sectors
    // },
    ...mapGetters([
      'path',
      'pathFromParam',
      'pathFromParamStatus',
      'fetchingData',
      'pathFoundInStore',
      'error',
      'whitelist',
      'keyProvidersBySector',
      'sessionsByKeyProviders',
      'keyProvidersBySectorSortedBySession',
      'keySectorsSortedByProviderCount'
    ])
  },
  methods: {
    ...mapActions([
      'getDataDynamic',
      'getPathFromParam2'
    ])
  },
  created () {
    if (!this.path) { // no page data in store
      this.getDataDynamic()
    } else {
      this.getPathFromParam2()
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
button {
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
  border-radius: 4px;
  margin: 10px;
  background-color: #384249;
  color: #fff;
}
button:hover {
  cursor: pointer;
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
