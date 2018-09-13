<template>
  <div id='WatchlistStars'>
    <div class='spinner size' v-if='polling || (inProcess === provider)'></div>
    <img v-else-if='isWatchlisted(provider)' v-on:click='removeProvider(provider)' class='star size' src='../assets/star-gold.png' alt='star' />
    <img v-else class='star size' v-on:click='addProvider(provider)' src='../assets/star-grey.png' alt='star' />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'WatchlistStars',
  props: ['provider'],
  computed: {
    ...mapState({
      watchlist: state => state.watchlist.watchlist,
      inProcess: state => state.watchlist.providerToAddOrRemove,
      polling: state => state.report.polling
    })
  },
  methods: {
    isWatchlisted (provider) {
      return this.watchlist.indexOf(provider) > -1
    },
    removeProvider (provider) {
      this.setWatchlistProviderToAddOrRemove(provider)
      this.watchlistRemoveProvider(provider)
    },
    addProvider (provider) {
      this.setWatchlistProviderToAddOrRemove(provider)
      this.watchlistAddProvider(provider)
    },
    ...mapActions([
      'watchlistAddProvider',
      'watchlistRemoveProvider',
      'setWatchlistProviderToAddOrRemove'
    ])
  }
}
</script>
<style>
.size {
  height: 30px;
  width: 30px;
  margin-bottom: -5px;
  margin-left: 10px;
}
.star {
  cursor: pointer;
}
.spinner {
  background: rgba(255,255,255,.5) url('../assets/spinner.gif') center center no-repeat;
  background-size: contain;
}
</style>
