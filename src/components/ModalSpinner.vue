<template>
  <div id='ModalSpinner' v-if='fetchingData'></div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      fetchingReport: state => state.report.fetchingData,
      fetchingWhitelist: state => state.whitelist.fetchingData
    }),
    fetchingData () {
      return this.fetchingReport || this.fetchingWhitelist
    }
  }
}
</script>

<style scoped>
#ModalSpinner {
  position: fixed;
  z-index: 999;
  height: 100%;
  width: 100%;
  background: rgba(255,255,255,.5) url('../assets/spinner.gif') center center no-repeat;
  background-size: 6rem;

}
</style>
