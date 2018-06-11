<template>
  <div>
    Edit timer {{$route.params.id}}
    <input v-model="time"/>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'

export default {
  computed: {
    time: {
      get() { return this.$store.state.timers[this.$route.params.id].time },
      set(value) {
        const time = Number(value)
        this.$store.commit('setTime', {id: this.$route.params.id, time})
      }
    }
  }
}
</script>
