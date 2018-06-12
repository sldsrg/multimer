<template>
  <div id="home">
    <div v-for="(t, i) in timers" :key="i">
      <timer :name="t.name" :time="t.time" :sound="t.sound"/>
      <router-link :to="`timers/${i}`">edit</router-link>
    </div>
    <button @click="add">Add</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Timer from './Timer.vue'

export default {
  name: 'home',
  components: {
    Timer
  },
  computed: {
    ...mapGetters(['timers'])
  },
  methods: {
    ...mapMutations(['addTimer']),
    add() {
      this.addTimer({time: 330})
    }
  }
}
</script>
