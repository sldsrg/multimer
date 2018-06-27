<template>
  <div id="home">
    <div v-for="(t, i) in timers" :key="i">
      <timer v-bind:id="t.id"/>
    </div>
    <a class="add" @click.prevent="add" href="#">Add {{timers.length > 0 ? 'another timer' : 'timer'}}</a>
    <div>
      Timers order:
      <select name="mode" id="mode" v-model="order">
        <option value="all">All together</option>
        <option value="seq">Start in sequence</option>
        <option value="man">Manually</option>
      </select>
    </div>
    <div class="globalControls" v-show="order !== 'man'">
      <button class="globalStartStop" @click="onStartStop"
      :disabled="status === 'completed'" >
        {{status === 'active' ? 'Stop' : 'Start'}}
      </button>
      <button class="globalReset" @click="onReset"
      :disabled="status === 'active' || status === 'ready'" >
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import Timer from './Timer'

export default {
  components: {
    Timer
  },
  computed: {
    timers() { return this.$store.state.timers },
    status() { return this.$store.state.status },
    order: {
      get() { return this.$store.state.order },
      set(value) { this.$store.commit('setOrder', value) }
    }
  },
  methods: {
    add() {
      this.$store.commit('addTimer', {
        time: 300,
        status: 'ready'
      })
    },
    onStartStop() {
      if (this.status === 'active') {
        this.$store.commit('setGlobalStatus', 'paused')
      } else {
        this.$store.commit('setGlobalStatus', 'active')
      }
    },
    onReset() {
      this.$store.commit('setGlobalStatus', 'ready')
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
