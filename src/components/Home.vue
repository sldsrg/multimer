<template>
  <div id="home">
    <div v-for="(t, i) in timers" :key="i">
      <timer v-bind:id="t.id"/>
    </div>
    <button class="add" @click="add">Add</button>
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
        time: 300
      })
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
