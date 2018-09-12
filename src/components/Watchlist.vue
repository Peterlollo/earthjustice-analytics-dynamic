<template>
  <h1>Provider Watchlist</h1>
  <ul>
  </ul>
</template>

<script>
import {mapState} from 'vuex'
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
  },
  created () {
  }
}
</script>

<style scoped>
</style>
