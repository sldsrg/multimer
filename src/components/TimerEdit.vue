<template>
  <div>
    Edit timer {{$route.params.id}}
    <div>
      Name: <input v-model="timer.name"/>
    </div>
    <div>
      Time: <input v-model="timer.time" type="number"/>s.
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
    return {
      sounds,
      timer: {...this.$store.state.timers[this.$route.params.id]}
    }
  },
  computed: {
  },
  methods: {
    testSound() {
      const test = new Audio(`/media/${this.timer.sound}.mp3`)
      test.play()
    },
    save() {
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
</style>
