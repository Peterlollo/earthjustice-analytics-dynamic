<template>
  <div class='days-ago'>
    <h2 class='no-font-weight'>Showing data from the last {{daysAgo}} days</h2>
    <button v-on:click='toggleDaysAgo' class='btn'>{{daysAgoBtnMsg}}</button>
    <div v-show='showDaysAgo' class='change-days-ago'>
      <label>From how many days ago do you want to fetch data?</label>
      <input type='number' min='1' v-model='newDaysAgo' placeholder='Example: 10'/>
      <button v-on:click='setDaysAgoAndFetchData()' class='btn'>Fetch Data</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      daysAgoBtnMsg: 'Edit',
      showDaysAgo: false,
      newDaysAgo: ''
    }
  },
  computed: {
    ...mapState({
      daysAgo: state => state.report.googleAnalyticsDaysAgo
    })
  },
  methods: {
    setDaysAgoAndFetchData () {
      this.toggleDaysAgo()
      this.setDaysAgo(this.newDaysAgo)
      this.getReportData()
    },
    toggleDaysAgo () {
      this.daysAgoBtnMsg = this.showDaysAgo ? 'Edit' : 'Hide'
      this.showDaysAgo = !this.showDaysAgo
    },
    ...mapActions([
      'whitelistAddProvider',
      'whitelistRemoveProvider',
      'getReportData',
      'getWhitelistData',
      'openModal',
      'setProviderToAdd',
      'setDaysAgo'
    ])
  }
}
</script>
<style>
.days-ago {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
</style>
