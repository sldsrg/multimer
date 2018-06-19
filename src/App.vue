<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    this.$store.commit('fromLocalStorage')
  }
}
</script>

<style>
</style>
