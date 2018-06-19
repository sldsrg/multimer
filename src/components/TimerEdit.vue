<template>
  <div>
    Edit timer {{$route.params.id}}
    <div>
      Name: <input v-model="timer.id"/>
    </div>
    <div class="time">
      Time: <input v-model="hrs" type="number"/> Hrs 
      <input v-model="mins" type="number"/> Mins
      <input v-model="secs" type="number"/> Secs
    </div>
    <div>
      Sound:
      <select v-model="timer.sound">
        <option v-for="(value, key) in sounds" :value="key" :key="key">
          {{value}}
        </option>
      </select>
      <button @click="testSound">Test sound</button>
    </div>
    <button @click="save">Save</button>
  </div>
</template>

<script>
import sounds from '../assets/sounds'

export default {
  data() {
    const timer = this.$store.state.timers.find(t => t.id === this.$route.params.id)
    const hrs = Math.floor(timer.time / 60 / 60)
    const mins = Math.floor((timer.time - hrs * 60) / 60)
    const secs = timer.time - (hrs * 60 + mins) * 60
    return { sounds, timer, hrs, mins, secs }
  },
  computed: {
    time: {
      get() { return this.timer.time },
      set(value) {
        this.timer.time = Number(value)
      }
    }
  },
  methods: {
    testSound() {
      const test = new Audio(`./media/${this.timer.sound}.mp3`)
      test.play()
    },
    save() {
      this.timer.time = Number((this.hrs * 60 + this.mins) * 60 + this.secs)
      this.$store.commit('setTimer', {id: this.$route.params.id, timer: this.timer})
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
div {
  margin: 8px;
}
.time input {
  width: 2rem;
  margin-left: 1rem;
}
</style>
