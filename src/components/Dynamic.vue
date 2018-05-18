<template>
  <div>
    <h1>Dynamic Data</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Dynamic',
  computed: {
    // ...mapGetters([ 'providers', 'isViewingProvider', 'pages' ])
  },
  methods: {
    ...mapActions([ 'getDataDynamic' ])
  },
  created () {
    this.getDataDynamic()
  }
}
</script>

<style scoped>
</style>
