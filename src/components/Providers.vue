<template>
  <div>
    <ul>
      <li v-for='provider in providers' :key='provider'>
        <button v-on:click='whitelistAddProvider({name: provider, sector: null})'>Add {{provider}} to whitelist</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Providers',
  computed: {
    ...mapGetters([ 'providers' ])
  },
  methods: {
    ...mapActions([
      'whitelistAddProvider',
      'getProviderData'
    ])
  },
  created () {
    if (!this.providers.length) { // no provider data in store
      this.getProviderData()
    }
  }
}
</script>

<style scoped>
.scroll-right {
    display: none;
  }
ul {
  border: solid 1px #dce0e0;
}
.provider {
  padding: 20px;
  border-bottom: 1px solid #dce0e0;
  margin-left: 10px;
  margin-right: 10px;
}
.provider:hover {
  cursor: pointer;
}
@media (max-width: 767px) {
  .scroll-down {
    display: none;
  }
  .scroll-right {
    display: block;
  }
  ul.provider-list {
    display: flex;
    flex-direction: row;
    max-width: 500px;
    overflow-x: scroll;
    margin: 0 auto;
  }
  .provider-list li {
    border-bottom: none;
    border-right: 1px solid #dce0e0;;
  }
}
</style>
