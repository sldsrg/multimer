<template>
  <div>
    Edit timer {{id}}
    <div>
      Name: <input v-model="tempId"/>
    </div>
    <div class="time">
      Time: <input v-model.number="hrs" type="number"/> Hrs
      <input v-model.number="mins" type="number"/> Mins
      <input v-model.number="secs" type="number"/> Secs
    </div>
    <div>
      Sound:
      <select v-model="sound">
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
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const timer = this.$store.getters.getTimerById(this.id)
    const hrs = Math.floor(timer.time / 60 / 60)
    const mins = Math.floor((timer.time - hrs * 60) / 60)
    const secs = timer.time - (hrs * 60 + mins) * 60
    return {
      tempId: this.id,
      sounds,
      sound: timer.sound, 
      hrs, 
      mins,
      secs
    }
  },
  computed: {
  },
  methods: {
    testSound() {
      const test = new Audio(`./media/${this.sound}.mp3`)
      test.play()
    },
    save() {
      const time = (this.hrs * 60 + this.mins) * 60 + this.secs
      this.$store.commit('setTimer', {
        id: this.id,
        data: {
          id: this.tempId,
          sound: this.sound,
          time,
          status: 'ready'
        }
      })
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
