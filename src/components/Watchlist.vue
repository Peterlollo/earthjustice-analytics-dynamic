<template>
  <div>
    <h1 class='page-title'>Watchlist</h1>
    <ul>
      <li v-for='provider in watchlist' :key='provider'>
        {{provider}}
        <img v-on:click='removeProvider(provider)' class='star size' src='../assets/star-gold.png' alt='star' />
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'Watchlist',
  components: {},
  data: () => {
    return {
    }
  },
  computed: {
    ...mapState({
      watchlist: state => state.watchlist.watchlist
    })
  },
  methods: {
    removeProvider (provider) {
      this.setWatchlistProviderToAddOrRemove(provider)
      this.watchlistRemoveProvider(provider)
    },
    ...mapActions([
      'watchlistRemoveProvider',
      'setWatchlistProviderToAddOrRemove'
    ])
  },
  created () {
  }
}
</script>

<style scoped>
.page-title {
  font-weight: 700;
  font-size: 5rem;
  margin: 0;
  margin-top: 35px;
}
.size {
  height: 30px;
  width: 30px;
  margin-bottom: -5px;
  margin-left: 10px;
}
.star {
  cursor: pointer;
}
li {
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid #dce0e0;
  font-size: 2rem;
}
li:last-of-type {
  border-bottom: none;
}
</style>
