<template>
  <div>
    <div>
      <span class="counter">{{formatTime(remaining)}}</span>
      <span class="controls">
        <button class="startStop" :disabled=startDisabled @click="startStop">{{intervalId ? 'Stop' : 'Start'}}</button>
        <button class="reset" :disabled=resetDisabled @click="reset">
          Reset
        </button>
      </span>
    </div>
    <div class="info">
      <span>{{id}} ({{formatTime(timer.time)}})</span>
      <font-awesome-icon :icon="icon" />
      <span>{{soundName}}</span>
      <a href="#" @click.prevent="edit">edit</a>
      <a href="#" @click.prevent="remove">remove</a>
      {{status}} <button @click="test">test</button>
    </div>
    <div class="progress">
      <progress :value="remaining" :max="timer.time"/>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSound from '@fortawesome/fontawesome-free-solid/faVolumeUp'
import sounds from '../assets/sounds'

export default {
  data() {
    const timer = this.$store.getters.getTimerById(this.id)
    return {
      remaining: timer ? timer.time : 0,
      intervalId: undefined
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    formatTime(t) {
      const pad = num => ('0' + num).substr(-2)
      const hours = Math.floor(t / 3600)
      const minutes = Math.floor((t - hours * 3600) / 60)
      const seconds = t - hours * 3600 - minutes * 60
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    },
    startStop() {
      if (this.intervalId) {
        // stop timer
        clearInterval(this.intervalId)
        this.intervalId = undefined
      } else {
        // start timer
        this.intervalId = setInterval(this.tick, 1000)
      }
    },
    start() {
      if (this.intervalId) {
        throw new Error('Timer already started')
      } else {
        this.intervalId = setInterval(this.tick, 1000)
      }
    },
    tick() {
      this.remaining -= 1
      if (this.remaining <= 0) {
        clearInterval(this.intervalId)
        this.intervalId = undefined
        this.playSound()
      }
    },
    reset() {
      this.remaining = this.timer.time
      this.$store.commit('setTimer', {id: this.id, timer: {status: 'ready'}})
    },
    playSound() {
      const audio = new Audio(`./media/${this.timer.sound}.mp3`)
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
    },
    test() {
      this.$store.commit('setTimer', {id: this.id, data: {status: 'active'}})
    }
  },
  computed: {
    timer() { return this.$store.getters.getTimerById(this.id) },
    status() { return this.timer.status },
    soundName() { return sounds[this.timer.sound] },
    startDisabled() {
      return (this.remaining === 0)
    },
    resetDisabled() {
      if (this.intervalId) return true
      if (this.remaining === this.timer.time) return true
      return false
    },
    icon () {
      return faSound
    }
  },
  watch: {
    status(newStatus, oldStatus) {
      switch (newStatus) {
        case 'active':
          this.start()
          break
        case 'ready':
          break
        case 'completed':
          break
      }
    }
  },
  components: {
    FontAwesomeIcon
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

button:disabled {
  background: lightgray;
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
