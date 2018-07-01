<template>
  <div>
    <div>
      <span class="counter">{{formatTime(remaining)}}</span>
      <span class="controls" v-show="order === 'man'">
        <button class="startStop" @click="onStartStop"
        :disabled="status === 'completed'" >
          {{status === 'active' ? 'Stop' : 'Start'}}
        </button>
        <button class="reset" @click="onReset"
        :disabled="status === 'ready' || status === 'active'" >
          Reset
        </button>
      </span>
    </div>
    <div class="info">
      <span>{{id}} ({{formatTime(timer.time)}})</span>
      <font-awesome-icon :icon="icon" />
      <span>{{soundName}}</span>
      <a href="#" @click.prevent="onEdit">edit</a>
      <a href="#" @click.prevent="onRemove">remove</a>
      Status: {{status}}
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
      remaining: timer ? timer.remaining : 0,
      intervalId: undefined
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.onStatus(this.timer.status)
  },
  destroyed() {
    this.$store.commit('setTimer', {id: this.id, data: {remaining: this.remaining}})
  },
  methods: {
    formatTime(t) {
      const pad = num => ('0' + num).substr(-2)
      const hours = Math.floor(t / 3600)
      const minutes = Math.floor((t - hours * 3600) / 60)
      const seconds = t - hours * 3600 - minutes * 60
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    },
    tick() {
      this.remaining -= 1
      if (this.remaining <= 0) {
        this.$store.commit('setTimer', {id: this.id, data: {status: 'completed'}})
        this.playSound()
      }
    },
    playSound() {
      const audio = new Audio(`./media/${this.timer.sound}.mp3`)
      audio.play()
    },
    onStartStop() {
      if (this.status === 'active') {
        this.$store.commit('setTimer', {id: this.id, data: {status: 'paused'}})
      } else {
        this.$store.commit('setTimer', {id: this.id, data: {status: 'active'}})
      }
    },
    onReset() {
      this.$store.commit('setTimer', {id: this.id, data: {status: 'ready'}})
    },
    onEdit() {
      this.$router.push({
        name: 'ModifyTimer',
        params: {id: this.id}
      })
    },
    onRemove() {
      this.$store.commit('removeTimer', this.id)
    },
    onStatus(status) {
      switch (status) {
        case 'active':
          if (this.intervalId) {
            // throw new Error('Timer already started')
          } else {
            this.intervalId = setInterval(this.tick, 1000)
          }
          break
        case 'ready':
          this.remaining = this.timer.time
          break
        case 'completed':
        case 'paused':
          if (this.intervalId) {
            // stop timer
            clearInterval(this.intervalId)
            this.intervalId = undefined
          } else {
            // throw new Error('Timer already stoped')
          }
          break
      }
    }
  },
  computed: {
    order() { return this.$store.state.order },
    timer() { return this.$store.getters.getTimerById(this.id) },
    status() { return this.timer.status },
    soundName() { return sounds[this.timer.sound] },
    icon() { return faSound }
  },
  watch: {
    status(newStatus, oldStatus) {
      this.onStatus(newStatus)
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
