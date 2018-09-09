<template>
  <transition name='blend'>
    <div class='modal-mask'>
      <div class='modal-wrapper' @click.self='closeModal()'>
        <div class='modal-container blend-container'>
          <header>
            <div class='button-container'>
              <button class='modal-default-button' @click='closeModal()'>
                <img src='../assets/button_round_close.png' alt='close' />
              </button>
            </div>
            <div class='logo'>
              <img src='../assets/ej-logo-white.png' alt='earthjustice logo' />
            </div>
          </header>

          <div class='modal-body'>
            <div class='modal-body-default-content'></div>
              <slot name='body'></slot>
          </div>

          <footer>
            <slot name='footer'></slot>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([ 'closeModal' ])
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 2147483647;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position: relative;
  display: block;
  width: 95%;
  max-width: 70rem;
  margin: 0px auto;
  letter-spacing: 0;
  border: .2rem solid var(--grey-blue);
  border-radius: 1rem;
  box-shadow: var(--popup-shadow);
  transition: all .3s ease;
  background-color: #fff;
}

.modal-container > header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 1.4rem;
  padding: .5rem 3rem;
  background-color: #38424A;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border: solid 2px #38424A;
}

.modal-container > header .logo {
  flex-basis: 100%;
  text-align: center;
}
.modal-container > header .logo > img {
  width: 6.4rem;
  height: 6.4rem;
}
.modal-container > header .button-container {
  flex-basis: 100%;
  text-align: right;
}
.modal-container > header .modal-default-button {
  width: 2em;
  height: 2em;
  padding: 0;
  border: 1px solid var(--grey-light);
  border-radius: 1em;
  background: white;
  line-height: 1em;
  color: var(--grey-blue)
}
.modal-container > header .modal-default-button:hover {
  cursor: pointer;
}
.modal-container > header .modal-default-button > img {
  width: 100%;
}
.modal-body {
  max-height: calc(100vh - 17rem);
  overflow-y: auto;
  font-size: 16px;
  padding: 20px;
}
.modal-body-default-content { margin: 2em 0; text-align: center; }
</style>
