<template>
  <div>
    <h1 class='title'>{{provider}}</h1>
    <h2 v-if='fetchingData || polling' class='polling'>Fetching more data...</h2>
    <h2 class='subtitle'>Pages</h2>
    <ul>
      <li class='path' v-for='(path, i) in paths' :key='path+i'>{{path}}</li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      provider: state => state.report.viewingProviderPagesFor,
      providerSessions: state => state.report.providerSessions,
      daysAgo: state => state.report.googleAnalyticsDaysAgo,
      fetchingData: state => state.report.fetchingProviderSessionData,
      polling: state => state.report.polling
    }),
    paths () {
      let providerSession = this.providerSessions[this.provider]
      let uniquePaths = []
      if (providerSession) { // check that there are any sessions available
        return providerSession.paths.filter((p) => {
          if (uniquePaths.indexOf(p) === -1) {
            uniquePaths.push(p)
            return true
          } else {
            return false
          }
        })
      } else {
        return [`No pages were visited by this provider in the last ${this.daysAgo} days`]
      }
    }
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 3rem;
  text-align: center;
}
.subtitle {
  font-weight: 700;
  font-size: 2rem;
}
.path {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
.path:last-of-type {
  border-bottom: none;
}
.polling {
  min-height: 35px;
  animation: blinker 2s linear infinite;
  font-size: 30px;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
