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
    playSound() {
      const audio = new Audio(`./media/${this.timer.sound}.mp3`)
      audio.play()
    },
    onStartStop() {
      if (this.status === 'active') {
        this.$store.commit('stopTimer', this.id)
      } else {
        this.$store.commit('startTimer', this.id)
      }
    },
    onReset() {
      this.$store.commit('resetTimer', this.id)
    },
    onEdit() {
      this.$router.push({
        name: 'ModifyTimer',
        params: {id: this.id}
      })
    },
    onRemove() {
      this.$store.commit('removeTimer', this.id)
    }
  },
  computed: {
    order() { return this.$store.state.order },
    timer() { return this.$store.getters.getTimerById(this.id) },
    status() { return this.timer.status },
    remaining() { return this.timer.remaining },
    soundName() { return sounds[this.timer.sound] },
    icon() { return faSound }
  },
  watch: {
    status(newStatus, oldStatus) {
      if (newStatus === 'completed') {
        this.playSound()
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
