<template>
  <div>
    <progress :value="remaining" :max="total"/>
    <span>{{formattedTime}}</span>
    <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sounds: [
        'media/whistle-flute-2.mp3',
        'media/bulb-horn-02.mp3',
        'media/magic-chime-01-m.mp3'
      ],
      remaining: this.time,
      total: this.time,
      timer: undefined
    }
  },
  props: {
    time: Number
  },
  methods: {
    start() {
      this.remaining -= 1
      this.timer = setInterval(() => {
        this.remaining -= 1
        if (this.remaining === 0) {
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
      const mySound = new Audio(this.sounds[2])
      mySound.play()
    }
  },
  computed: {
    formattedTime() {
      const pad = num => ('0' + num).substr(-2)
      const minutes = Math.floor(this.remaining / 60)
      const seconds = this.remaining - minutes * 60
      return `${minutes}:${pad(seconds)}`
    }
  }
}
</script>
<style scoped>

</style>
