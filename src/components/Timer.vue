<template>
  <div>
    <div>
      <span class="counter">{{formatTime(remaining)}}</span>
      <span class="controls">
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button class="reset" :disabled=resetDisabled @click="reset">
          Reset
        </button>
      </span>
    </div>
    <div class="info">
      <span>{{id}} ({{formatTime(time)}})</span>
      <span>{{soundName}}</span>
      <a href="#" @click.prevent="edit">edit</a>
      <a href="#" @click.prevent="remove">remove</a>
    </div>
    <div class="progress">
      <progress :value="remaining" :max="time"/>
    </div>
  </div>
</template>

<script>
import sounds from '../assets/sounds'

export default {
  data() {
    return {
      remaining: this.time,
      intervalId: undefined
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    time: Number,
    sound: String
  },
  methods: {
    formatTime(t) {
      const pad = num => ('0' + num).substr(-2)
      const minutes = Math.floor(t / 60)
      const seconds = t - minutes * 60
      return `${minutes}:${pad(seconds)}`
    },
    start() {
      this.intervalId = setInterval(() => {
        this.remaining -= 1
        if (this.remaining <= 0) {
          clearInterval(this.intervalId)
          this.playSound()
        }
      }, 1000)
    },
    stop() {
      clearInterval(this.intervalId)
    },
    reset() {
      this.remaining = this.time
    },
    playSound() {
      const audio = new Audio(`./media/${this.sound}.mp3`)
      audio.play()
    },
    edit() {
      this.$router.push({
        name: 'ModifyTimer',
        params: {id: this.id}
      })
    },
    remove() {
      this.$store.commit('removeTimer', this.id)
    }
  },
  computed: {
    soundName() { return sounds[this.sound] },
    resetDisabled() {
      if (this.intervalId) return true
      if (this.remaining === this.time) return true
      return false
    }
  }
}
</script>

<style scoped>
.counter {
  font-size: 3rem;
}

.progress {
  margin-top: 5px;
  margin-bottom: 30px;
  width: 100%;
}

a, span {
  margin: 12px;
}

progress {
  width: 90%;
  height: 40px;
}

button {
  width: 3rem;
  height: 3rem;
  background: lightblue;
  border: none;
  border-radius: 50% 50%;
  margin: 3px;
  outline: none;
}

button:enabled:hover {
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
