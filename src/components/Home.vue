<template>
  <div id="home">
    <div v-for="(t, i) in timers" :key="i">
      <timer v-bind:id="t.id"/>
    </div>
    <a class="add" @click.prevent="add" href="#">Add {{timers.length > 0 ? 'another timer' : 'timer'}}</a>
    <div>
      Timers order:
      <select name="mode" id="mode">
        <option value="all">All together</option>
        <option value="seq">Start in sequence</option>
        <option value="man">Manually</option>
      </select>
    </div>
    <button @click="test('active')">Start</button>
    <button @click="test('paused')">Stop</button>
    <button @click="test('ready')">Reset</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Timer from './Timer'

export default {
  name: 'home',
  components: {
    Timer
  },
  computed: {
    ...mapState(['timers'])
  },
  methods: {
    ...mapMutations(['addTimer']),
    add() {
      this.addTimer({
        time: 300,
        status: 'ready'
      })
    },
    test(status) {
      this.$store.commit('setAllTimers', {status})
    }
  }
}
</script>

<style scoped>
button {
  width: 3rem;
  height: 3rem;
  background: lightblue;
  border: none;
  border-radius: 50% 50%;
  margin: 3px;
  outline: none;
}

button:hover {
  background: #000;
  color: #fff;
  -webkit-transition-duration: .5s;
  transition-duration: .5s;
}

button::-moz-focus-inner {
  border: 0;
  padding: 0;
}
</style>
