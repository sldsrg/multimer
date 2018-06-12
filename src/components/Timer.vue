<template>
  <div>
    <span>{{name}}</span>
    <progress :value="remaining" :max="total"/>
    <span>{{formattedTime}}</span>
    <span>{{soundName}}</span>
    <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import sounds from '../assets/sounds'

export default {
  data() {
    return {
      remaining: this.time,
      total: this.time,
      timer: undefined
    }
  },
  props: {
    name: String,
    time: Number,
    sound: String
  },
  methods: {
    start() {
      this.timer = setInterval(() => {
        this.remaining -= 1
        if (this.remaining <= 0) {
          clearInterval(this.timer)
          this.playSound()
        }
      }, 1000)
    },
    stop() {
      clearInterval(this.timer)
    },
    reset() {
      this.remaining = this.total
    },
    playSound() {
      const sound = new Audio(`/media/${this.sound}.mp3`)
      sound.play()
    }
  },
  computed: {
    formattedTime() {
      const pad = num => ('0' + num).substr(-2)
      const minutes = Math.floor(this.remaining / 60)
      const seconds = this.remaining - minutes * 60
      return `${minutes}:${pad(seconds)}`
    },
    soundName() { return sounds[this.sound] }
  }
}
</script>
<style scoped>

</style>
