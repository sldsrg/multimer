export default {

  fromLocalStorage(state, value) {
    const data = localStorage.getItem('store')
    if (data) {
      const store = JSON.parse(data)
      for (const timer of store.timers) {
        timer.status = 'ready'
      }
      Object.assign(state, store)
    }
  },

  addTimer(state, value) {
    if (!value.id) { value.id = `Timer ${state.timers.length + 1}` }
    state.timers.push(value)
  },

  setTimer(state, {id, data}) {
    state.timers = state.timers.map(t => t.id === id ? {...t, ...data, id} : t)
  },

  removeTimer(state, id) {
    state.timers = state.timers.filter(t => t.id !== id)
  },

  setOrder(state, value) {
    state.order = value
  },

  setGlobalStatus(state, value) {
    state.status = value
    state.timers = state.timers.map(t => Object.assign(t, {status: value}))
  }
}
