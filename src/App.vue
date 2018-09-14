<template>
  <div id='app'>
    <ModalSpinner></ModalSpinner>
    <ModalSectors v-if='modalOpen && (modalName === "addProviderToWhitelist")'></ModalSectors>
    <ModalProviderPages v-if='modalOpen && (modalName === "providerPages")'></ModalProviderPages>
    <header id='header'>
      <a v-on:click='changeRoute("/")'><img src='./assets/ej-logo-white.png' class='logo'></a>
    </header>
    <div class='container'>
      <div class='main-row'>
        <router-view name='sidebar' id='router-sidebar'/>
        <router-view name='main' id='router-main'/>
      </div>
    </div>
    <footer id='footer'></footer>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ModalSectors from './components/ModalSectors'
import ModalProviderPages from './components/ModalProviderPages'
import ModalSpinner from './components/ModalSpinner'
import Router from './router'
export default {
  name: 'App',
  components: {ModalSectors, ModalSpinner, ModalProviderPages},
  computed: {
    ...mapState({
      modalOpen: state => state.modal.modalOpen,
      modalName: state => state.modal.modalName
    })
  },
  methods: {
    changeRoute (route) {
      Router.push(route)
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-size: 12px;
  max-width: 100%;
  overflow-x: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  flex: 1 0 100%;
  background: ;
  color: #484848;
  min-height: 100vh;
}
#app > #header {
  background-color: #38424A;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 5px;
}
#header .logo {
  padding-left: 50px;
  max-height: 100px;
}
#app > .container {
  flex: 1 0 auto;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  width: calc(100% - 1.5rem * 2);
}
.main-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
}
#router-sidebar {
  max-height: 500px;
  overflow-y: scroll;
}
#footer {
  min-height: 200px;
  background-color: #384249;
  width: 100%;
  background-image: url('./assets/ej-logo-white.png');
  background-size: contain;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
}

h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
  cursor: pointer;
}
ul {
  list-style-type: none;
  padding: 0;
  font-size: 14px;
}
.btn {
  border: none;
  border-radius: 2px;
  background-color: #26a69a;
  color: #fff;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 2rem;
  text-transform: uppercase;
  vertical-align: middle;
  -webkit-tap-highlight-color: transparent;
  font-size: 1.35rem;
  outline: 0;
  cursor: pointer;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
}
.btn:hover {
  background-color: #2bbbad;
}

.btn-secondary {
  background-color: #319ad4;
}

input {
  padding: 15px;
  background: rgba(255,255,255,0.5);
  margin: 0 0 10px 0;
  width: 100px;
  font-size: 1.35rem;
}

/* Transitions! usage: <transition name="blend">…</transition> */
.blend-enter, .blend-leave-active { opacity: 0; }
.blend-enter .blend-container,
.blend-leave-active .blend-container {
  transform: scale(1.1);
}

/*********** Media Queries  **********/
/***********************************/

@media (max-width: 767px) {
  html, body {
    font-size: 10px;
  }
  #app > #header {
    justify-content: center;
  }
  #header .logo {
    padding-left: 0;
  }
}

@media (min-width: 768px) {
  #app > .container {
    width: 750px;
  }
  .main-row {
    flex-direction: row;
  }
  #router-sidebar {
    flex: 1;
  }
  #router-main {
    flex: 2;
  }
}

@media (min-width: 1024px) {
  #app > .container {
    width: 970px;
  }
}

@media (min-width: 1280px) {
  #app > .container {
    width: 1170px;
  }
}
</style>
