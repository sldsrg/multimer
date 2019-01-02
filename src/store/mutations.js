import Vue from 'vue'

export default {

  fromLocalStorage(state, value) {
    const data = localStorage.getItem('store')
    if (data) {
      const store = JSON.parse(data)
      Object.assign(state, store)
      for (let t of state.timers) {
        // pause all timers with saved status 'active'
        if (t.status === 'active') { t.status = 'paused' }
      }
    }
  },

  tick({ timers, order }) {
    for (let i = 0; i < timers.length; i++) {
      if (timers[i].status === 'active') {
        timers[i].remaining--
        if (timers[i].remaining <= 0) {
          timers[i].status = 'completed'
          if (order === 'seq') {
            for (let j = i + 1; j < timers.length; j++) {
              if (['ready', 'paused'].includes(timers[j].status)) {
                timers[j].status = 'active'
                return // in "seq" mode only one timer can by active
              }
            }
          }
        }
      }
    }
  },

  addTimer(state, value) {
    if (!value.id) { value.id = `Timer ${state.timers.length + 1}` }
    state.timers.push(value)
  },

  startTimer({ timers }, id) {
    const i = timers.findIndex(t => t.id === id)
    timers[i].status = 'active'
  },

  stopTimer({ timers }, id) {
    const i = timers.findIndex(t => t.id === id)
    timers[i].status = 'paused'
  },

  resetTimer({ timers }, id) {
    for (const timer of timers) {
      if (timer.id === id) {
        timer.status = 'ready'
        timer.remaining = timer.time
        break
      }
    }
  },

  resetAllTimers({ timers }, id) {
    for (const timer of timers) {
      timer.status = 'ready'
      timer.remaining = timer.time
    }
  },

  removeTimer(state, id) {
    state.timers = state.timers.filter(t => t.id !== id)
  },

  setOrder(state, value) {
    state.order = value
  },

  setGlobalStatus(state, value) {
    if (state.order === 'all') {
      state.timers = state.timers.map(t => {
        switch (value) {
          case 'completed':
          case 'ready': return Object.assign(t, { status: value })
          case 'paused': return t.status === 'active' ? Object.assign(t, { status: value }) : t
          case 'active': return t.status === 'completed' ? t : Object.assign(t, { status: value })
          default: return t
        }
      })
    } else if (state.order === 'seq') {
      for (const timer of state.timers) {
        switch (value) {
          case 'active':
            if (timer.status === 'ready' || timer.status === 'paused') {
              timer.status = value
              return
            }
            break
          case 'paused':
            if (timer.status === 'active') {
              timer.status = value
              return
            }
            break
          case 'ready':
            timer.status = value
            break
          default:
            break
        }
      }
    }
  },

  setupTimer({ timers }, { id, data }) {
    const i = timers.findIndex(t => t.id === id)
    const timer = { ...timers[i], ...data }
    if (timer.remaining > timer.time) {
      timer.remaining = timer.time
    } else if (timer.status === 'ready') {
      timer.remaining = timer.time
    }
    Vue.set(timers, i, timer)
  }
}
