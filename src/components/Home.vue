<template>
  <div class='section no-border-bottom'>
    <h1 class='page-title'>Earthjustice Web Analytics</h1>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.section {
  margin-top: 60px;
  padding-bottom: 60px;
  margin-bottom: 60px;
  border-bottom: solid 2px black;
}
.no-border-bottom {
  border-bottom-color: transparent;
}
.page-title {
  font-weight: 700;
  font-size: 5rem;
  margin: 0;
}
@media (max-width: 767px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
