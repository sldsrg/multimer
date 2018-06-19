export default {

  fromLocalStorage(state, value) {
    const store = localStorage.getItem('store')
    if (store) {
      Object.assign(state, JSON.parse(store))
    }
  },

  addTimer(state, value) {
    if (!value.id) { value.id = `Timer ${state.timers.length + 1}` }
    state.timers.push(value)
  },

  setTimer(state, {id, timer}) {
    state.timers = state.timers.map(t => t.id === id ? {...t, id} : t)
  },

  removeTimer(state, id) {
    state.timers = state.timers.filter(t => t.id !== id)
  }
}
