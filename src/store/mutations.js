export default {

  fromLocalStorage(state, value) {
    const data = localStorage.getItem('store')
    if (data) {
      const store = JSON.parse(data)
      Object.assign(state, store)
    }
  },

  addTimer(state, value) {
    if (!value.id) { value.id = `Timer ${state.timers.length + 1}` }
    state.timers.push(value)
  },

  setTimer(state, {id, data}) {
    state.timers = state.timers.map(t => t.id === id ? {id, ...t, ...data} : t)
    if (state.order === 'seq' && data.status === 'completed') {
      const current = state.timers.findIndex(t => t.id === id)
      for (let i = current + 1; i < state.timers.length; i++) {
        if (state.timers[i].status === 'ready') {
          state.timers[i].status = 'active'
        }
      }
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
          case 'ready': return Object.assign(t, {status: value})
          case 'paused': return t.status === 'active' ? Object.assign(t, {status: value}) : t
          case 'active': return t.status === 'completed' ? t : Object.assign(t, {status: value})
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
  }
}
