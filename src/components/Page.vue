<template>
  <div>

    <div v-if='fetchingData'>
      <h1>Fetching data...</h1>
    </div>

    <div v-else-if='error'>
      <h1>Sorry, there was an error retrieving data from server</h1>
      <p>Please try again</p>
      <button v-on:click='getDataDynamic'>Fetch Data</button>
    </div>

    <div v-else-if='pagePathFromParamStatus === "success" && !pageFoundInStore'>
      <h1>Sorry, could not find that page path</h1>
      <p>{{ pathMsgError }}<a>{{ pathMsgErrorLink }}</a></p>
      <p>Or, try fetching the Google Analytics data</p>
      <button v-on:click='getDataDynamic'>Fetch Data</button>
    </div>

    <div v-else-if='pagePathFromParamStatus === "success" && pageFoundInStore'>
      <h2>Page</h2>
      <h1>{{pagePathFromParam}}</h1>
      <div class='list-header'><h2>Key Sectors</h2><h2>Count</h2></div>
      <ul>
        <li v-for='sector in Object.keys(keySectors)' :key='sector'>
          <div>{{sector}}</div><div>{{keySectors[sector]}}</div>
        </li>
      </ul>
      <ul>
        <li><h2>Key Providers</h2><h2>Total Time On Page (seconds)</h2></li>
        <li v-for='provider in keyProviders' :key='provider'>
          <div>{{provider}}</div><div>{{page[provider].reduce((a, v) => a + v)}}</div>
        </li>
      </ul>
      <ul>
        <li><h2>All Providers</h2><h2>Total Time On Page (seconds)</h2></li>
        <li v-for='provider in allProviders' :key='provider'>
          <div>{{provider}}</div><div>{{page[provider].reduce((a, v) => a + v)}}</div>
        </li>
      </ul>
      <h2>Page</h2>
      {{ page }}
    </div>

    <div v-else-if='pagePathFromParamStatus === "fail"'>
      <h1>Something's wrong with the URL's "path" parameter</h1>
      <p>{{ pathMsgError }}<a>{{ pathMsgErrorLink }}</a></p>
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
    allProviders () {
      return Object.keys(this.page)
    },
    keyProviders () {
      return this.allProviders.filter((p) => this.whitelist[p])
    },
    keySectors () {
      let sectors = {}
      this.keyProviders.map((kp) => {
        let sector = this.whitelist[kp].sector
        sectors[sector] = sectors[sector] + 1 || 1
      })
      console.log('keySectors: ', sectors)
      return sectors
    },
    ...mapGetters([
      'providers',
      'isViewingPage',
      'pagePathFromParam',
      'pagePathFromParamStatus',
      'pages',
      'allViewsOfCurrentPage',
      'providersAndTimesGroupedForViewsOfCurrentPage',
      'keyProviderIds',
      'currentPageWithTimesKeyProviders',
      'currentPageWithTimesNotKeyProviders',
      'fetchingData',
      'pageFoundInStore',
      'error',
      'page',
      'whitelist'
    ])
  },
  methods: {
    ...mapActions([
      'getData',
      'getDataDynamic',
      'getPagePathFromParam',
      'getPagePathFromParam2',
      'whitelistAddOrRemoveProvider'
    ])
  },
  created () {
    if (!Object.keys(this.pages).length) { // no page data in store
      let parsedUrl = new URL(window.location.href)
      let path = parsedUrl.searchParams.get('path')
      this.getDataDynamic(path)
    } else {
      this.getPagePathFromParam2()
    }
  }
}
</script>

<style scoped>
.list-header {
  padding-left: 5px;
  padding-right: 5px;
}
.list-header, li {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
li {
  padding: 5px;
  border-bottom: 1px solid #dce0e0;
}
.title {
  margin-top: 50px;
}
.visitors {
  color: rgb(0, 132, 137);
  margin-top: 60px;
}
h1, h2 {
  font-weight: 700;
  margin: 0;
}
h1 {
  font-size: 3em;
}
h2 {
  font-size: 2em;
}
ul {
  border: solid 1px #dce0e0;
  font-size: 16px;
  margin-bottom: 100px;
  margin-top: 0;
}
li:last-child {
  border-bottom-color: transparent;
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
</style>
