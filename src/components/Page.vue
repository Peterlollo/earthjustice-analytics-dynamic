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
      <h3>Page</h3>
      <h1>{{pagePathFromParam}}</h1>
      <h2>Key Sectors</h2>
      {{ keySectors }}
      <h2>Key Providers</h2>
      {{ keyProviders }}
      <h2>All Providers</h2>
      {{ allProviders }}
      <h2>Page</h2>
      {{ page }}
      <!-- <h1 class='visitors'>Important Visitors: {{ currentPageWithTimesKeyProviders.length }}</h1>
      <ul>
        <li v-for='providerTime in currentPageWithTimesKeyProviders' v-bind:key='providerTime[0]'>
          <div><strong>Provider:</strong> {{ getProviderFromID(providerTime[0]).name }}</div>
          <div><strong>Sector:</strong> {{ getProviderFromID(providerTime[0]).sector }}</div>
          <div><strong>Time On Page:</strong> {{ providerTime[1] }} seconds</div>
          <button v-on:click='whitelistAddOrRemoveProvider({ action: "remove", id: providerTime[0] })'>Remove From Whitelist</button>
        </li>
      </ul>
      <h1 class='visitors'>Non-Important Visitors: {{ currentPageWithTimesNotKeyProviders.length }}</h1>
      <ul>
        <li v-for='providerTime in currentPageWithTimesNotKeyProviders' v-bind:key='providerTime[0]'>
          <div><strong>Provider:</strong> {{ getProviderFromID(providerTime[0]).name }}</div>
          <div><strong>Time On Page:</strong> {{ providerTime[1] }} seconds</div>
          <button v-on:click='whitelistAddOrRemoveProvider({ action: "add", id: providerTime[0] })'>Add To Whitelist</button>
        </li>
      </ul> -->
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
      var uniqueSectors = []
      this.keyProviders.map((kp) => {
        let sector = this.whitelist[kp].sector
        if (uniqueSectors.indexOf(sector) === -1) {
          uniqueSectors.push(sector)
        }
      })
      return uniqueSectors
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
    // getProviderNameFromID (id) {
    //   return this.providers.filter((p) => p.id === id)[0].name
    // },
    // getProviderFromID (id) {
    //   return this.providers.filter((p) => p.id === id)[0]
    // },
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
    // grab path from url param and add to Searching for all views of page: _______
    // Todo: remove?: this.getData()
    // check for path in store
    // if !store.pages.length ||  path !found in store
    // update pagePathParamStatus to "fail"
    // explain failure in UI, and show button allowing another data fetch
    // else if path found in store
    // update pagePathParamStatus to "success"
  }
}
</script>

<style scoped>
.title {
  margin-top: 50px;
}
.visitors {
  color: rgb(0, 132, 137);
  margin-top: 60px;
}
h1 {
  font-weight: 700;
}
ul {
  border: solid 1px #dce0e0;
  font-size: 16px;
}
li {
  padding: 20px;
  border-bottom: 1px solid #dce0e0;
  margin-left: 10px;
  margin-right: 10px;
}
.pageviews, .pageviews li {
  border: none;
}
.pageviews li {
  background-color: #eee;
}
li > * {
  margin: 5px;
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
