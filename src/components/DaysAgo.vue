<template>
  <div class='days-ago'>
    <h2>Showing data from the last {{daysAgo}} days</h2>
    <button v-on:click='toggleDaysAgo' class='btn'>{{daysAgoBtnMsg}}</button>
    <div v-show='showDaysAgo' class='change-days-ago'>
      <label>Number of days ago</label>
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
  props: ['filter'],
  computed: {
    ...mapState({
      daysAgo: state => state.report.googleAnalyticsDaysAgo
    })
  },
  methods: {
    setDaysAgoAndFetchData () {
      this.toggleDaysAgo()
      this.setDaysAgo(this.newDaysAgo)
      this.getReportData({filter: this.filter})
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
  border: solid 1px #eee;
  padding: 20px;
  width: 300px;
  align-items: flex-start;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.days-ago .btn {
  max-width: 100px;
}
.days-ago .change-days-ago {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.change-days-ago input {
  min-width: 200px;
}
.change-days-ago label {
  font-size: 2rem;
}
@media(max-width: 767px) {
  .days-ago {
    width: 250px;
  }
}
</style>
